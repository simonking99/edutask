import pytest
import unittest.mock as mock
from src.controllers.usercontroller import UserController

#@pytest.mark.unit
#def test_valid_email_with_no_user():
    # Mocking the dependencies
    #mocked_usercontroller = mock.MagicMock()
    # Create one user for the email
    #mocked_usercontroller.find.return_value = []
    
    # Creating UserController instance with mocked data_object
    #sut = UserController(dao=mocked_usercontroller)
    
    # Call the method under test
    #validation_result = sut.get_user_by_email('test4444@test.com')
    #assert validation_result is None

@pytest.mark.unit
def test_valid_email_with_single_user():
    # Mocking the dependencies
    mocked_usercontroller = mock.MagicMock()
    # Create one user for the email
    mocked_usercontroller.find.return_value = [{"User": "user1" , "email": 'test@test.com'}]
    
    # Creating UserController instance with mocked data_object
    sut = UserController(dao=mocked_usercontroller)
    
    # Call the method under test
    validation_result = sut.get_user_by_email('test@test.com')
    # Assert the result
    assert validation_result

@pytest.mark.unit
def test_valid_email_with_multiple_users():
    # Mocking the dependencies
    mocked_usercontroller = mock.MagicMock()
    # Create multiple users for the email
    mocked_usercontroller.find.return_value = [{"User": "user1" , "email": 'test@test.com'}, {"User": "user2" , "email": 'test@test.com'}, {"User": "user3" , "email": 'test@test.com'}]
    
    # Creating UserController instance with mocked data_object
    sut = UserController(dao=mocked_usercontroller)
    
    # Call the method under test
    validation_result = sut.get_user_by_email('test@test.com')
    # Assert the result
    assert validation_result

#@pytest.mark.unit
#def test_unvalid_email():
   # mocked_usercontroller = mock.MagicMock()
    # Mocking the dependencies
    #mocked_usercontroller.find.return_value = [{'email': 'unvalid_email'}]
    # Creating unvalid email

    # Creating UserController instance with mocked data_object
    #sut = UserController(dao=mocked_usercontroller)
    # Call the method under test
    #validation_result = sut.get_user_by_email('unvalid_email')
    # Assert the result
   # assert validation_result
