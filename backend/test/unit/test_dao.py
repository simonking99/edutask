import pytest
from unittest.mock import patch, MagicMock
from pymongo import MongoClient
from pymongo.errors import WriteError
import json
from src.util.dao import DAO
# Path to the validator file
file_path = '/root/winhome/system/edutask/backend/src/static/validators/user.json'

@pytest.fixture
def sut():
    # Read from json file
    with open(file_path, 'r') as file:
        json_f = json.load(file)

    with patch('src.util.dao.getValidator', autospec=True) as mock_Validator:
        mock_Validator.return_value = json_f

        sut = DAO("user")
        
        yield sut

    client = MongoClient('mongodb://root:root@localhost:27017')
    db = client['edutask']
    db['user'].drop()


def test_create_valid_data(sut):
    data_obj = {"firstName": "firstname", "lastName": "lastName", "email": "email@example.com"}
    assert sut.create(data_obj)

def test_create_invalid_data(sut):
    data_obj = {"firstName": 1, "lastName": "lastName", "email": "email@example.com"}
    assert sut.create(data_obj)

def test_create_missing_required_data(sut):
    data_obj = {"firstName": "firstname", "email": "email@example.com"}
    assert sut.create(data_obj)

def test_create_add_data(sut):
    data_obj = {"firstName": "firstName", "lastName": "lastName", "email": "email@example.com", "added_value": "test"}
    assert sut.create(data_obj)

def test_create_empty_data(sut):
    data_obj = {}
    assert sut.create(data_obj)

def test_create_unique_data(sut):
    data_obj_1 = { "firstName": "firstName", "lastName": "lastName", "email": "email@example.com"}
    sut.create(data_obj_1)
    data_obj_2 = { "firstName": "firstName", "lastName": "lastName", "email": "email@example.com"}
    with pytest.raises(WriteError):
        sut.create(data_obj_2)
