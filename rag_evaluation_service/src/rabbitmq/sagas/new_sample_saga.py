import pika
import json
from src.rabbitmq.rabbitmq_connection import channel

queue_name='agent_service:new_sample'

def callback(ch, method, properties, body):
    try:
        prompt_data = json.loads(body)
        input_prompt = prompt_data['input']
        options = prompt_data['options']
        print(prompt_data)
        
        # Generate code based on the prompt
        response = prompt(input_prompt, options)

        # Print the result (you can save it to a file, send it back to a queue, etc.)
        print(f"Generated response: \n{response}")
        
        success_message = {
            "input": input_prompt,
            "response": response
        }

        success_queue = queue_name + '_success'
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

def consume_from_queue():
    # Declare the same queue from which to receive messages
    channel.queue_declare(queue=queue_name)
    # Start consuming messages from the queue
    channel.basic_consume(queue=queue_name, on_message_callback=callback)
    print(' [*] Waiting for messages. To exit press CTRL+C')
    channel.start_consuming()

# Start the consumer to listen for messages and generate code
consume_from_queue()
