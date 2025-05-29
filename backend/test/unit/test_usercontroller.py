import pytest
import unittest.mock as mock
from src.controllers.usercontroller import UserController


@pytest.mark.unit
def test_valid_email_with_no_user():
    # Skapar en mock av usercontroller, så vi kan kontrollera dess beteende under testet
    mocked_uc = mock.MagicMock()

    # Ställer in mocken att returnera en tom lista när find-metoden anropas (Alltså ingen user)
    mocked_uc.find.return_value = []
    
    # Skapar en instans av UserController med den mockade dao (data access object)
    sut = UserController(dao=mocked_uc)
    
    # Anropar get_user_by_email-metoden med en giltig e-postadress som inte finns i databasen
    validation_result = sut.get_user_by_email('test@gmail.com')
    
    # Kontrollerar att resultatet är None om ingen user hittas
    assert validation_result is None

@pytest.mark.unit
def test_valid_email_with_single_user():
    mocked_uc = mock.MagicMock()

    # Ställer in mocken att returnera en email som har en user
    mocked_uc.find.return_value = [{"User": "testuser", "email": 'test@gmail.com'}]

    sut = UserController(dao=mocked_uc)

    # Anropar get_user_by_email-metoden med en giltig e-postadress
    validation_result = sut.get_user_by_email('test@gmail.com')
    
    #Kontrollerar att user finns
    assert validation_result

@pytest.mark.unit
def test_valid_email_with_multiple_users():
    mocked_uc = mock.MagicMock()

    # Ställer in mocken att returnera en email med flertal users
    mocked_uc.find.return_value = [
        {"User": "user1", "email": 'test@gmail.com'},
        {"User": "user2", "email": 'test@gmail.com'}
    ]
    sut = UserController(dao=mocked_uc)
    validation_result = sut.get_user_by_email('test@gmail.com')

    #Kontrollerar att resultat är den första user
    assert validation_result

@pytest.mark.unit
def test_invalid_email():
    mocked_uc = mock.MagicMock()
    mocked_uc.find.return_value = []
    sut = UserController(dao=mocked_uc)

    # Förväntar oss att ett ValueError kastas för ogiltig e-post
    with pytest.raises(ValueError):
        sut.get_user_by_email('1234')


@pytest.mark.unit
def test_exception():
    mocked_dao = mock.MagicMock()

    # Konfigurerar mocken så att find-metoden kastar ett Exception när den anropas
    mocked_dao.find.side_effect = Exception()
    mocked_uc = UserController(dao=mocked_dao)

    #Testet kontrollerar att get_user_by_email-metoden kastar ett undantag av typen Exception när den anropas med mailen
    with pytest.raises(Exception):
        mocked_uc.get_user_by_email('test@gmail.com')
