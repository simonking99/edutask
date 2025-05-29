import pytest
from unittest.mock import patch, MagicMock
from pymongo import MongoClient
from pymongo.errors import WriteError
import os
import json
file_path = os.path.join(os.path.dirname(__file__), '/root/winhome/system/edutask/backend/src/static/validators/user.json')


def get_documents_from_mongodb(query={}, projection=None):
    """
    Retrieve documents from a MongoDB collection.

    Parameters:
        db_name (str): The name of the database.
        collection_name (str): The name of the collection.
        query (dict, optional): The query to filter documents. Default is an empty dict.
        projection (dict, optional): The fields to include or exclude. Default is None.

    Returns:
        list: A list of documents from the collection.
    """
    try:
        # Establish a connection to the MongoDB server
        client = MongoClient('mongodb://root:root@localhost:27017')

        # Access the database
        db = client["edutask"]

        # Access the collection
        collection = db["user"]

        # Retrieve the documents
        documents = collection.find(query, projection)

        # Convert the documents to a list
        document_list = list(documents)

        return document_list

    except Exception as e:
        print(f"An error occurred: {e}")
        return []