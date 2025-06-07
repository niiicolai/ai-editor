import sys
import os
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '../../..')))
from embedding_service.src.services.embedding_service import embed, embed_all
from fastapi import HTTPException
import pytest


@pytest.mark.parametrize("options", [
    ({"chunk": "a"}),
    ({"chunk": "aa"}),
    ({"chunk": "aaa"}),
])
def test_embed_codeT5p_valid_partitions(mock_codeT5p, options):
    result = embed(options['chunk'], "Salesforce/codet5p-110m-embedding")
    
    assert result['chunk'] == options['chunk']
    assert result['embedding'] == [0.1, 0.2, 0.3]
    mock_codeT5p.assert_called_once_with([options['chunk']])


@pytest.mark.parametrize("options", [
    ({"chunk": "a"}),
    ({"chunk": "aa"}),
    ({"chunk": "aaa"}),
])
def test_embed_allMini_valid_partitions(mock_allMini, options):
    result = embed(options['chunk'], "all-MiniLM-L6-v2")
    
    assert result['chunk'] == options['chunk']
    assert result['embedding'] == [0.1, 0.2, 0.3]
    mock_allMini.assert_called_once_with([options['chunk']])


@pytest.mark.parametrize("options, errorType, errorMessage", [
    ({"chunk": None, "model": "all-MiniLM-L6-v2"}, HTTPException, "Chunk is required"),
    ({"chunk": "a", "model": None}, HTTPException, "Model is required"),
    ({"chunk": "a", "model": "unsupported_model"}, HTTPException, "Unsupported Model"),
])
def test_embed_invalid_partitions(mock_allMini, options, errorType, errorMessage):
    with pytest.raises(errorType, match=errorMessage):
        embed(options['chunk'], options['model'])
    
    
@pytest.mark.parametrize("options", [
    ({"chunks": ["a"]}),
    ({"chunks": ["aa"]}),
    ({"chunks": ["aaa"]}),
])
def test_embed_all_codeT5p_valid_partitions(mock_codeT5p, options):
    result = embed_all(options['chunks'], "Salesforce/codet5p-110m-embedding")
    
    assert result[0]['chunk'] == options['chunks'][0]
    assert result[0]['embedding'] == [0.1, 0.2, 0.3]
    mock_codeT5p.assert_called_once_with(options['chunks'])
    
    
@pytest.mark.parametrize("options", [
    ({"chunks": ["a"]}),
    ({"chunks": ["aa"]}),
    ({"chunks": ["aaa"]}),
])
def test_embed_all_allMini_valid_partitions(mock_allMini, options):
    result = embed_all(options['chunks'], "all-MiniLM-L6-v2")
    
    assert result[0]['chunk'] == options['chunks'][0]
    assert result[0]['embedding'] == [0.1, 0.2, 0.3]
    mock_allMini.assert_called_once_with(options['chunks'])
 
 
@pytest.mark.parametrize("options, errorType, errorMessage", [
    ({"chunks": None, "model": "all-MiniLM-L6-v2"}, HTTPException, "Chunks is required"),
    ({"chunks": ["a"], "model": None}, HTTPException, "Model is required"),
    ({"chunks": ["a"], "model": "unsupported_model"}, HTTPException, "Unsupported Model"),
])
def test_embed_all_invalid_partitions(mock_allMini, options, errorType, errorMessage):
    with pytest.raises(errorType, match=errorMessage):
        embed_all(options['chunks'], options['model'])