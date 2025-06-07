import sys
import os
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '../../..')))
from embedding_service.src.services.jwt_service import verify, generate
import pytest


@pytest.mark.parametrize("options", [
    ({"_id": "12", "role": "member"}),
])
def test_generate_valid_partitions(options):
    token = generate(options['_id'], options['role'])
    
    assert isinstance(token, str)


@pytest.mark.parametrize("options, errorType, errorMessage", [
    ({"_id": None, "role": "member"}, Exception, "_id is required"),
    ({"_id": "12", "role": None}, Exception, "Role is required"),
])
def test_generate_invalid_partitions(options, errorType, errorMessage):
    with pytest.raises(errorType, match=errorMessage):
        generate(options['_id'], options['role'])


@pytest.mark.parametrize("options", [
    ({"_id": "12", "role": "member"}),
])
def test_verify_valid_partitions(options):
    token = generate(options['_id'], options['role'])
    result = verify(token)
    
    assert result['_id'] == options['_id']
    assert result['role'] == options['role']


@pytest.mark.parametrize("options, errorType, errorMessage", [
    ({"token": None}, Exception, "Token is required"),
])
def test_verify_invalid_partitions(options, errorType, errorMessage):
    with pytest.raises(errorType, match=errorMessage):
        verify(options['token'])

