import json
import threading
import asyncio
from src.rabbitmq.rabbitmq_connection import get_channel
from src.services.sample_service import create_many

queue_name='new_sample:rag_evaluation_service'

loop = asyncio.new_event_loop()
def start_loop():
    asyncio.set_event_loop(loop)
    loop.run_forever()


def callback(ch, method, properties, body):
    try:
        data = json.loads(body)
        
        transaction = data['transaction']
        sample = data['sample']
        input_prompt = sample['input_prompt']
        input_embedded_files = sample['input_embedded_files']
        output_response = sample['output_response']
        llm_config = sample['llm_config']
        embedding_config = sample['embedding_config']
        chunk_config = sample['chunk_config']
        search_config = sample['search_config']
        event_config = sample['event_config']
        
        asyncio.run_coroutine_threadsafe(create_many([{
            "input_prompt": input_prompt,
            "input_embedded_files": input_embedded_files,
            "output_response": output_response,
            "event": event_config,
            "config": {
                "llm": llm_config,
                "embedding_model": embedding_config,
                "chunking_strategy": chunk_config,
                "search_strategy": search_config
            }
        }]), loop)
        
        success_message = {
            "transaction": transaction,
        }

        success_queue = queue_name + '_success'
        
        channel = get_channel()
        channel.queue_declare(queue=success_queue)
        channel.basic_publish(
            exchange='',
            routing_key=success_queue,
            body=json.dumps(success_message)
        )

        print(f"Sent to success queue: {success_message}")

        # Acknowledge that the message was processed
        ch.basic_ack(delivery_tag=method.delivery_tag)
    except Exception as e:
        print(f"Error processing message: {e}")
        error_queue = queue_name + '_error'
        channel.queue_declare(queue=error_queue)
        channel.basic_publish(
            exchange='',
            routing_key=error_queue,
            body=json.dumps({ 'error': f"Error processing message: {e}" })
        )
        ch.basic_ack(delivery_tag=method.delivery_tag)

def consume_samples_queue():
    channel = get_channel()
    channel.queue_declare(queue=queue_name)
    channel.basic_consume(queue=queue_name, on_message_callback=callback)
    print('INFO:     new_sample_saga.py loaded')
    channel.start_consuming()

def start_consumer_thread():
    threading.Thread(target=start_loop, daemon=True).start()
    
    thread = threading.Thread(target=consume_samples_queue, daemon=True)
    thread.start()
