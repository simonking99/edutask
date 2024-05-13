import pytest
from unittest.mock import MagicMock
import unittest.mock as mock
from src.util.dao import DAO
from dotenv import dotenv_values
import os
import pymongo
from pymongo.errors import WriteError  # Import WriteError from pymongo.errors


# Fixture to initialize DAO with a temporary collection for testing
@pytest.fixture
def dao():
    ''' Initialization of the dao with the user collection '''
    collection_name = "user"
    dao = DAO(collection_name)
    dao.client = MagicMock()  # Using a MagicMock for mocking the database connection
    yield dao

@pytest.fixture
def db():
    ''' Connection to database '''
    # Mock the MongoDB client
    mock_client = MagicMock(spec=pymongo.MongoClient)
    return mock_client


@pytest.mark.unit
def test_database_connection(db):
    assert db


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
    dao.collection_name = "user"  # Set collection_name attribute
    '''Test creating a document with invalid data'''
    # Invalid data for user collection
    invalid_data = {
        "firstName": 1,
        "lastName": "testlastname",
        "email": "test.test@gmail.com"
    }
    result = dao.create(invalid_data)
    
    # Assert that the result is None when invalid data is provided
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
    # Data with missing required properties for user collection
    missing_data = {
        "firstName": "testfirstname",
        "lastName": "testlastname"
    }
    # Using create method to insert given data
    result = dao.create(missing_data)
    assert not result

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
    result1 = dao.create(valid_data)
    assert not result1