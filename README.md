# AI Code Editor

## Agent Service
Agent Service is a modular microservice designed for intelligent data processing and interaction. It integrates RESTful APIs, a vector database, and machine learning models to provide embedding, search, and interaction capabilities.

### Deploy
[![Deploy Agent Service](https://github.com/niiicolai/ai-editor/actions/workflows/deploy_agent_service.yml/badge.svg)](https://github.com/niiicolai/ai-editor/actions/workflows/deploy_agent_service.yml)
```bash
git checkout release-agent-service
git merge main
git push origin release-agent-service
```

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

### Deploy
[![Deploy Auth Service](https://github.com/niiicolai/ai-editor/actions/workflows/deploy_auth_service.yml/badge.svg)](https://github.com/niiicolai/ai-editor/actions/workflows/deploy_auth_service.yml)
```bash
git checkout release-auth-service
git merge main
git push origin release-auth-service
```

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

### Deploy
[![Deploy Payment Service](https://github.com/niiicolai/ai-editor/actions/workflows/deploy_payment_service.yml/badge.svg)](https://github.com/niiicolai/ai-editor/actions/workflows/deploy_payment_service.yml)
```bash
git checkout release-payment-service
git merge main
git push origin release-payment-service
```

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

### Deploy
[![Deploy Docs Service](https://github.com/niiicolai/ai-editor/actions/workflows/deploy_docs_service.yml/badge.svg)](https://github.com/niiicolai/ai-editor/actions/workflows/deploy_docs_service.yml)
```bash
git checkout release-docs-service
git merge main
git push origin release-docs-service
```

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

### Deploy
[![Deploy Email Service](https://github.com/niiicolai/ai-editor/actions/workflows/deploy_email_service.yml/badge.svg)](https://github.com/niiicolai/ai-editor/actions/workflows/deploy_email_service.yml)
```bash
git checkout release-email-service
git merge main
git push origin release-email-service
```

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

## Embedding Service

### Deploy
[![Deploy Embedding Service](https://github.com/niiicolai/ai-editor/actions/workflows/deploy_embedding_service.yml/badge.svg)](https://github.com/niiicolai/ai-editor/actions/workflows/deploy_embedding_service.yml)
```bash
git checkout release-embedding-service
git merge main
git push origin release-embedding-service
```

## RAG Evaluation Service

### Deploy
[![Deploy RAG Evaluation Service](https://github.com/niiicolai/ai-editor/actions/workflows/deploy_rag_evaluation_service.yml/badge.svg)](https://github.com/niiicolai/ai-editor/actions/workflows/deploy_rag_evaluation_service.yml)
```bash
git checkout release-rag-evaluation-service
git merge main
git push origin release-rag-evaluation-service
```

## Nginx

### Deploy
[![Deploy Nginx](https://github.com/niiicolai/ai-editor/actions/workflows/deploy_nginx.yml/badge.svg)](https://github.com/niiicolai/ai-editor/actions/workflows/deploy_nginx.yml)
```bash
git checkout release-nginx
git merge main
git push origin release-nginx
```

## App Client
The App Client is a modern frontend application built with React, featuring dynamic routing via React Router and styled using Tailwind CSS for a clean and responsive UI. While the core UI stack is fully implemented, Docker support for streamlined deployment is planned.

### Deploy
[![Deploy App Client](https://github.com/niiicolai/ai-editor/actions/workflows/deploy_app_client.yml/badge.svg)](https://github.com/niiicolai/ai-editor/actions/workflows/deploy_app_client.yml)
```bash
git checkout release-app-client
git merge main
git push origin release-app-client
```

### Features
| Feature                | Subfeature                          | Status  |
|------------------------|-------------------------------------|---------|
| **Framwork**           | React                               |   [x]   |
| **Routing**            | React-router                        |   [x]   |
| **Styling**            | Tailwindcss                         |   [x]   |
| **Docker**             | Dockerfile                          |   [ ]   |

## App Desktop
The App Desktop is a full-featured desktop application built with React, Vite, and Electron, offering a rich developer experience with integrated tools like Monaco Editor, terminal with tab support, file explorer, search, and keyboard shortcuts. It uses React Router for navigation, Redux for state management, and Tailwind CSS for styling. AI integration is available through a chat interface with “Ask” functionality, with future plans for Agent, Research, and AI-driven code completions. Extension support and Docker deployment are also planned for future updates.

### Deploy

```bash
git tag editor-v*.*.*
git push origin editor-v*.*.*
```

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

# Sample Projects

# Sample Results

# Server
