import numpy as np
import pandas as pd
from sklearn.cluster import KMeans
from sklearn.metrics import silhouette_score
import boto3
import os

topics = ['cats', 'dogs', 'sea', 'mountains', 'soccer', 'basketball', 'summer', 'winter', 'pizza', 'burger']

### Fake Data ###
# data = pd.DataFrame(np.random.choice(2, [100, 10]))
# data.columns = ["Column" + str(i) for i in range(len(data.columns))]
# data['index'] = ["User" + str(i) for i in range(len(data))]
# data.set_index('index', drop=True, inplace=True)


### Clustering script ###
def clustering_function(data, n_of_k, n=2, ):
    list_l = []
    list_i = []
    list_j = []
    list_combined = []

    for i in range(2, n_of_k):
        model = KMeans(n_clusters=n_of_k, init="random", n_init=1, max_iter=300)
        model.fit(data)
        labels = model.labels_
        check_labels = np.unique(labels, return_counts=True)

        list_l.append(silhouette_score(data, labels))
        list_i.append(i)
        list_j.append(check_labels)
        list_combined = list(zip(list_i, list_l, list_j))

    # Select best K (condition to enough users in clusters)
    while True:
        max_score = max([list_combined[i][1] for i in range(len(list_combined))])
        best_k = [list_combined[i][0] for i in range(len(list_combined)) if list_combined[i][1] == max_score][0]
        corr_i = [i for i in range(len(list_combined)) if list_combined[i][1] == max_score][0]
        if min(list_combined[corr_i][2][1]) > n:
            break
        else:
            del list_combined[corr_i]

    # train the best model
    model = KMeans(n_clusters=best_k, init="random", n_init=1, max_iter=300)
    model.fit(data)

    return model


### Matching ###
def matching(model, data, user):
    subselection = data[data.labels == data.loc[str(user), 'labels']]
    while True:
        match = np.random.choice(subselection.index, 1)
        if match != str(user):
            break
    return match


### Topics ###
def what_to_talk_about(model, data, user, n):
    centroids = pd.DataFrame(model.cluster_centers_)
    selected_centroid = centroids[centroids.index == data.loc[str(user), 'labels']]
    selected_centroid_T = selected_centroid.T.squeeze()
    selected_centroid_T.index = selected_centroid.columns
    return selected_centroid_T.nlargest(n).index


def create_data_frame(entries):
    matrix = {}
    for entry in entries:
        if entry['id'] not in matrix:
            matrix[entry['id']] = []
        for topic in topics:
            if topic in entry:
                matrix[entry['id']].append(1 if entry[topic] == 'yes' else 0)
            else:
                matrix[entry['id']].append(0)

    return pd.DataFrame.from_dict(matrix, orient='index', columns=topics)


def main(event, context):
    candidate = event['queryStringParameters']['user']
    dynamodb = boto3.resource('dynamodb', region_name='eu-central-1')
    table = dynamodb.Table(os.environ['TABLE'])
    users = table.scan()['Items']

    data = create_data_frame(users)
    cluster = clustering_function(data, 5, 2)

    ### Add clusters to the database ###
    data['labels'] = cluster.labels_

    user_matched = matching(cluster, data, candidate)
    topics_matched = what_to_talk_about(cluster, data, candidate, 3)

    return {
        'user_matched': user_matched[0],
        'topics_matched': topics_matched.values.tolist()
    }
