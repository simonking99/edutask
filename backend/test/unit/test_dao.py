import pytest
from unittest.mock import MagicMock
from src.util.dao import DAO
from dotenv import dotenv_values
import os
import pymongo


# Fixture to initiliaze connection to Database
@pytest.fixture
def db():
    ''' Connection to database '''
    local_mongo_url = dotenv_values('.env').get('MONGO_URL')
    mongo_url = os.environ.get('MONGO_URL', local_mongo_url)

    client = pymongo.MongoClient(mongo_url)
    return client

# Fixture to initialize DAO with a temporary collection for testing
@pytest.fixture
def dao():
    ''' Initialization of the dao with the user collection '''
    # Using the user file validator
    collection_name = "user"
    dao = DAO(collection_name)
    return dao

@pytest.mark.unit
def test_database_connection(db): 
    ''' Test database connection '''
    assert db is not None

@pytest.mark.unit
def test_create_valid_data(dao):
    '''Test creating a document with valid data'''
    # Valid data for user collection
    valid_data = {
        "firstName": "testfirstname",
        "lastName": "testlastname",
        "email": "test.test@gmail.com"
    }
    # Using create method to insert given data
    result = dao.create(valid_data)
    assert result

@pytest.mark.unit
def test_create_invalid_data(dao):
    '''Test creating a document with invalid data'''
    # Valid data for user collection
    valid_data = {
        "firstName": 1,
        "lastName": "testlastname",
        "email": "test.test@gmail.com"
    }
    # Using create method to insert given data
    result = dao.create(valid_data)
    assert result

@pytest.mark.unit
def test_create_add_to_valid_data(dao):
    '''Test adding additional data to a valid document'''
    # Valid data for user collection
    valid_data = {
        "firstName": "testfirstname",
        "lastName": "testlastname",
        "email": "test.test@gmail.com",
        "testvalue": "testtesttest"
    }
    # Using create method to insert given data
    result = dao.create(valid_data)
    assert result  

@pytest.mark.unit
def test_create_missing_data(dao):
    '''Test creating a document with a missing required properties'''
    # Valid data for user collection
    valid_data = {
        "firstName": "testfirstname",
        "lastName": "testlastname"
    }
    # Using create method to insert given data
    result = dao.create(valid_data)
    assert result 

@pytest.mark.unit
def test_create_unique_value(dao):
    '''Test creating a document by inserting an un unique value'''
    # Valid data for user collection
    valid_data = {
        "firstName": "testfirstname",
        "lastName": "testlastname",
        "email": "test.test@gmail.com"
    }
    # Using create method to insert given data
    result = dao.create(valid_data)
    assert result  

    # Attempt to insert a second document with the same email address
    result = dao.create(valid_data)
    assert not result 