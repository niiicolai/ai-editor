export interface SampleType {
    _id: string;
    input_prompt: string;
    input_embedded_files: any[];
    output_response: string;
    event: string;
    config: {
        llm: string;
        embedding_model: string;
        chunking_strategy: string;
        search_strategy: string;
    };
    metrics: {
        context_precision: number;
        response_relevancy: number;
        faithfulness: number;
    };
    created_at: string;
    updated_at: string;
}

export interface SamplesType {
    samples: SampleType[];
    total: number;
    pages: number;
    limit: number;
    page: number;
    stats: {
        average_context_precision: number;
        average_response_relevancy: number;
        average_faithfulness: number;
        min_context_precision: number;
        max_context_precision: number;        
        min_response_relevancy: number;       
        max_response_relevancy: number;               
        min_faithfulness: number;
        max_faithfulness: number;
        median_context_precision: number;
        median_response_relevancy: number;
        median_faithfulness: number;
    }
}
