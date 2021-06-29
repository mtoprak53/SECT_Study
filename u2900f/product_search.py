import requests
from time import time


def product_search(BASE_URL, ENDPOINT, KEY, search_item):

    url = BASE_URL + ENDPOINT

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


def food_search(url, CONSUMER_KEY):

    params = {
        "method": "food.search",
        "oauth_consumer_key": CONSUMER_KEY,
        "oauth_nonce": "1234",
        "oauth_signature": "sAyYTJiIxOGkvFpBcH8L%2BlFQRCQ%3D",
        "oauth_signature_method": "HMAC-SHA1",
        "oauth_timestamp": int(time()),
        "oauth_version": "1.0",
        "format": "json",
    }

    r = requests.get(url, params=params)
    # print('Status: ' + str(r.status_code))
    return r

