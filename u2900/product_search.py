import requests

# BASE_URL = 'https://www.foodrepo.org/api/v3'
# KEY = "a406e5b9080f30b45b4e79c011478fe2"
# ENDPOINT = '/products/_search'


def product_search(BASE_URL, ENDPOINT, KEY, search_item):

    url = BASE_URL + ENDPOINT

    # query = {
    #     "query": {
    #         "wildcard": {
    #         # "_all_names" : f"*{search_item}*"
    #         "_all_names" : f"{search_item}"
    #         }
    #     }
    # }


    query = {
        "_source": {
            "includes": [
            "name_translations",
            "barcode",
            "nutrients.sugars.per_hundred"
            ]
        },
        "size": 20,
        "query": {
            "query_string": {
            "fields" : [
                "name_translations.fr"
            ],
            # "query" : "Jogurt~ OR Yaourt~"
            "query" : f"{search_item}~"
            }
        },
        "sort": "nutrients.sugars.per_hundred"
    }



    headers = {
    'Authorization': "Token token=" + KEY,
    'Accept': 'application/json',
    'Content-Type': 'application/vnd.api+json',
    'Accept-Encoding': 'gzip,deflate'
    }

    r = requests.post(url, json=query, headers=headers)
    # print('Status: ' + str(r.status_code))
    return r
    



        # results = r.json()
        # print('Number of products found: ' + str(results['hits']['total']))
        # print('First few products...')
        # for hit in results['hits']['hits']:
        #     print('  ' + hit['_source']['display_name_translations']['en'])
