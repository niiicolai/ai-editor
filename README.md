# AI Code Editor
AI Code Editor is an intelligent, cross-platform development environment combining powerful editing features with AI assistance. It offers a desktop and web client built with React, Electron, and Tailwind CSS, integrated with services for authentication, payments, documentation, email, and GPT-2-based text generation—all connected through a scalable microservice architecture.

## Agent Service
Agent Service is a modular microservice designed for intelligent data processing and interaction. It integrates RESTful APIs, a vector database, and machine learning models to provide embedding, search, and interaction capabilities.

### Features
| Feature                | Subfeature                          | Status  |
|------------------------|-------------------------------------|---------|
| **REST API**           | Error Handling                      |   [x]   |
|                        | Exception Logging                   |   [x]   |
|                        | Swagger API Documentation           |   [x]   |
|                        | HATEOAS                             |   [x]   |
|                        | JWT Middleware                      |   [x]   |
| **Database**           | MongoDB                             |   [x]   |
|                        | Mongoose (ODM)                      |   [x]   |
|                        | Automatic backup                    |   [ ]   |
| **Vector Database**    | Qdrant                              |   [x]   |
|                        | Upsert                              |   [x]   |
|                        | Delete                              |   [x]   |
|                        | Search                              |   [x]   |
|                        | Automatic backup                    |   [ ]   |
| **Vector Embedding**   | Model Orchestrator                  |   [x]   |
|                        | all-MiniLM-L6-v2                    |   [x]   |
| **LLM**                | Model Orchestrator                  |   [ ]   |
|                        | gpt-4o-mini                         |   [x]   |
|                        | gemini-2.0-flash-exp                |   [ ]   |
|                        | fine-tuned gpt2                     |   [ ]   |
| **Message Broker**     | Rabbitmq                            |   [x]   |
|                        | Choreographed sagas                 |   [ ]   |
| **Websocket**          | Server                              |   [x]   |
|                        | Events                              |   [x]   |
|                        | MessagePack                         |   [ ]   |
| **Docker**             | Dockerfile                          |   [ ]   |

## Auth Service
The Auth Service is a secure and modular authentication microservice that provides robust REST API functionality with full support for error handling, exception logging, HATEOAS, and JWT-based middleware. It leverages MongoDB with Mongoose for data management and integrates with RabbitMQ for message-based communication. The service is documented via Swagger and designed for future expansion with features like automatic backups, choreographed sagas, and Dockerized deployment.

### Features
| Feature                | Subfeature                          | Status  |
|------------------------|-------------------------------------|---------|
| **REST API**           | Error Handling                      |   [x]   |
|                        | Exception Logging                   |   [x]   |
|                        | Swagger API Documentation           |   [x]   |
|                        | HATEOAS                             |   [x]   |
|                        | JWT Middleware                      |   [x]   |
| **Database**           | MongoDB                             |   [x]   |
|                        | Mongoose (ODM)                      |   [x]   |
|                        | Automatic backup                    |   [ ]   |
| **Message Broker**     | Rabbitmq                            |   [x]   |
|                        | Choreographed sagas                 |   [ ]   |
| **Docker**             | Dockerfile                          |   [ ]   |

## Payment Service
The Payment Service is a secure and scalable microservice built to handle payment operations via Stripe, backed by a REST API with comprehensive features like error handling, JWT authentication, Swagger documentation, and HATEOAS support. It uses MongoDB with Mongoose for data persistence and integrates with RabbitMQ for asynchronous communication. While core features are production-ready, future enhancements include choreographed saga support, automatic database backups, and Dockerized deployment.

### Features
| Feature                | Subfeature                          | Status  |
|------------------------|-------------------------------------|---------|
| **REST API**           | Error Handling                      |   [x]   |
|                        | Exception Logging                   |   [x]   |
|                        | Swagger API Documentation           |   [x]   |
|                        | HATEOAS                             |   [x]   |
|                        | JWT Middleware                      |   [x]   |
| **Payment**            | Stripe                              |   [x]   |
| **Database**           | MongoDB                             |   [x]   |
|                        | Mongoose (ODM)                      |   [x]   |
|                        | Automatic backup                    |   [ ]   |
| **Message Broker**     | Rabbitmq                            |   [x]   |
|                        | Choreographed sagas                 |   [ ]   |
| **Docker**             | Dockerfile                          |   [ ]   |

## Docs Service
The Docs Service is a microservice designed for managing and serving documentation-related data through a fully featured REST API, offering error handling, HATEOAS support, and JWT-secured endpoints, all documented via Swagger. It relies on MongoDB with Mongoose for data storage and integrates RabbitMQ for event-driven communication. While core capabilities are in place, upcoming improvements include support for choreographed sagas, automated backups, and containerization with Docker.

### Features
| Feature                | Subfeature                          | Status  |
|------------------------|-------------------------------------|---------|
| **REST API**           | Error Handling                      |   [x]   |
|                        | Exception Logging                   |   [x]   |
|                        | Swagger API Documentation           |   [x]   |
|                        | HATEOAS                             |   [x]   |
| **Database**           | MongoDB                             |   [x]   |
|                        | Mongoose (ODM)                      |   [x]   |
|                        | Automatic backup                    |   [ ]   |
| **Message Broker**     | Rabbitmq                            |   [x]   |
|                        | Choreographed sagas                 |   [ ]   |
| **Docker**             | Dockerfile                          |   [ ]   |

## Email Service
The Email Service is a backend microservice focused on handling email-related operations, currently backed by MongoDB with Mongoose and integrated with RabbitMQ for asynchronous messaging. While support for Gmail integration and choreographed sagas is planned, its core infrastructure is in place, with upcoming features including automated backups and Docker support for deployment.

### Features
| Feature                | Subfeature                          | Status  |
|------------------------|-------------------------------------|---------|
| **Email**              | Gmail                               |   [ ]   |
| **Database**           | MongoDB                             |   [x]   |
|                        | Mongoose (ODM)                      |   [x]   |
|                        | Automatic backup                    |   [ ]   |
| **Message Broker**     | Rabbitmq                            |   [x]   |
|                        | Choreographed sagas                 |   [ ]   |
| **Docker**             | Dockerfile                          |   [ ]   |

## GPT2 Service
The GPT2 Service is a lightweight language model microservice designed to generate text responses using GPT-2, with message-based communication facilitated by RabbitMQ. While response generation is functional, support for fine-tuning and training with sample data is planned, along with future enhancements such as choreographed sagas and Docker-based deployment.

### Features
| Feature                | Subfeature                          | Status  |
|------------------------|-------------------------------------|---------|
| **LLM**                | Fine-tuning                         |   [ ]   |
|                        | Sample data                         |   [ ]   |
|                        | Generate response                   |   [x]   |
| **Message Broker**     | Rabbitmq                            |   [x]   |
|                        | Choreographed sagas                 |   [ ]   |
| **Docker**             | Dockerfile                          |   [ ]   |

## App Client
The App Client is a modern frontend application built with React, featuring dynamic routing via React Router and styled using Tailwind CSS for a clean and responsive UI. While the core UI stack is fully implemented, Docker support for streamlined deployment is planned.

### Features
| Feature                | Subfeature                          | Status  |
|------------------------|-------------------------------------|---------|
| **Framwork**           | React                               |   [x]   |
| **Routing**            | React-router                        |   [x]   |
| **Styling**            | Tailwindcss                         |   [x]   |
| **Docker**             | Dockerfile                          |   [ ]   |

## App Desktop
The App Desktop is a full-featured desktop application built with React, Vite, and Electron, offering a rich developer experience with integrated tools like Monaco Editor, terminal with tab support, file explorer, search, and keyboard shortcuts. It uses React Router for navigation, Redux for state management, and Tailwind CSS for styling. AI integration is available through a chat interface with “Ask” functionality, with future plans for Agent, Research, and AI-driven code completions. Extension support and Docker deployment are also planned for future updates.

### Features
| Feature                | Subfeature                          | Status  |
|------------------------|-------------------------------------|---------|
| **Framwork**           | React                               |   [x]   |
|                        | Vite                                |   [x]   |
|                        | Electron                            |   [x]   |
| **Routing**            | React-Router                        |   [x]   |
| **State Management**   | React-Redux                         |   [x]   |
| **Styling**            | Tailwindcss                         |   [x]   |
| **Editor**             | Monaco Editor                       |   [x]   |
| **Editor Tabs**        |                                     |   [x]   |
| **Explorer**           |                                     |   [x]   |
| **Search**             |                                     |   [x]   |
| **Terminal**           |                                     |   [x]   |
| **Terminal Tabs**      |                                     |   [x]   |
| **Keyboard Shortcuts** |                                     |   [x]   |
| **Extensions**         |                                     |   [ ]   |
| **AI Chat**            |                                     |   [x]   |
|                        | Ask                                 |   [x]   |
|                        | Agent                               |   [ ]   |
|                        | Research                            |   [ ]   |
| **AI Code Completions**|                                     |   [ ]   |
| **Docker**             | Dockerfile                          |   [ ]   |
