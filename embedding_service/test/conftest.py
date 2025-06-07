import pytest

@pytest.fixture(scope="function")
def mock_codeT5p(mocker):
    return mocker.patch(
        'embedding_service.src.services.embedding_service.codeT5p',
        return_value = [[0.1, 0.2, 0.3]]
    ) 

@pytest.fixture
def mock_allMini(mocker):
    return mocker.patch(
        "embedding_service.src.services.embedding_service.allMiniLmL6v2",
        return_value = [[0.1, 0.2, 0.3]]
    )
