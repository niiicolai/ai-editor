
# Certbot
echo "Downloading and installing certbot"
sudo apt install certbot

# Docker
echo "Removing conflicting packages (Docker)"
for pkg in docker.io docker-doc docker-compose docker-compose-v2 podman-docker containerd runc; do sudo apt-get remove $pkg; done
echo "Setup Docker's apt repository"
sudo apt-get update
sudo apt-get install ca-certificates curl
sudo install -m 0755 -d /etc/apt/keyrings
sudo curl -fsSL https://download.docker.com/linux/ubuntu/gpg -o /etc/apt/keyrings/docker.asc
sudo chmod a+r /etc/apt/keyrings/docker.asc
echo \
  "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.asc] https://download.docker.com/linux/ubuntu \
  $(. /etc/os-release && echo "${UBUNTU_CODENAME:-$VERSION_CODENAME}") stable" | \
  sudo tee /etc/apt/sources.list.d/docker.list > /dev/null
sudo apt-get update
echo "Downloading and installing Docker"
sudo apt-get install docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin

# K3d
echo "Downloading and installing k3d"
wget -q -O - https://raw.githubusercontent.com/k3d-io/k3d/main/install.sh | bash

# Kubectl
echo "Downloading and installing kubectl"
curl -LO "https://dl.k8s.io/release/$(curl -L -s https://dl.k8s.io/release/stable.txt)/bin/linux/amd64/kubectl"
echo "Configure kubectl permission"
chmod +x kubectl

# Kompose
echo "Downloading and installing kompose"
curl -L https://github.com/kubernetes/kompose/releases/download/v1.36.0/kompose-linux-amd64 -o kompose
echo "Configure kompose permission"
chmod +x ./kompose

# Configure cluster
echo "Creating new cluster"
k3d cluster create --api-port 6550 \
  -p "80:80@loadbalancer" \
  -p "443:443@loadbalancer" \
  --agents 1 \
  -v /etc/letsencrypt:/etc/letsencrypt

echo "Printing cluster info"
./kubectl cluster-info

echo "1. import Docker images by running (May take a while):"
echo "k3d image import <image-name>"
echo "k3d image import editor_nginx:v1.0"
echo "k3d image import agent_service:v1.0"
echo "k3d image import payment_service:v1.0"
echo "k3d image import docs_service:v1.0"
echo "k3d image import auth_service:v1.0"
echo "k3d image import email_service:v1.0"
echo "k3d image import embedding_service:v1.0"
echo "k3d image import rag_evaluation_service:v1.0"
echo "k3d image import app_client:v1.0"

echo "2. obtain TLS certificates using sudo certbot certonly --standalone -d domain"
echo "sudo certbot certonly --standalone -d editor-agent.c7pixel.com"
echo "sudo certbot certonly --standalone -d editor-payment.c7pixel.com"
echo "sudo certbot certonly --standalone -d editor-auth.c7pixel.com"
echo "sudo certbot certonly --standalone -d editor-docs.c7pixel.com"
echo "sudo certbot certonly --standalone -d editor-email.c7pixel.com"
echo "sudo certbot certonly --standalone -d editor-embedding.c7pixel.com"
echo "sudo certbot certonly --standalone -d editor-rag-evaluation.c7pixel.com"
echo "sudo certbot certonly --standalone -d demo.c7pixel.com"

echo "3. add TLS secrets"
echo "./kubectl create secret tls agent-tls \
  --cert=/etc/letsencrypt/live/editor-agent.c7pixel.com/fullchain.pem \
  --key=/etc/letsencrypt/live/editor-agent.c7pixel.com/privkey.pem"
echo "./kubectl create secret tls payment-tls \
  --cert=/etc/letsencrypt/live/editor-payment.c7pixel.com/fullchain.pem \
  --key=/etc/letsencrypt/live/editor-payment.c7pixel.com/privkey.pem"
echo "./kubectl create secret tls auth-tls \
  --cert=/etc/letsencrypt/live/editor-auth.c7pixel.com/fullchain.pem \
  --key=/etc/letsencrypt/live/editor-auth.c7pixel.com/privkey.pem"
echo "./kubectl create secret tls docs-tls \
  --cert=/etc/letsencrypt/live/editor-docs.c7pixel.com/fullchain.pem \
  --key=/etc/letsencrypt/live/editor-docs.c7pixel.com/privkey.pem"
echo "./kubectl create secret tls email-tls \
  --cert=/etc/letsencrypt/live/editor-email.c7pixel.com/fullchain.pem \
  --key=/etc/letsencrypt/live/editor-email.c7pixel.com/privkey.pem"
echo "./kubectl create secret tls embedding-tls \
  --cert=/etc/letsencrypt/live/editor-embedding.c7pixel.com/fullchain.pem \
  --key=/etc/letsencrypt/live/editor-embedding.c7pixel.com/privkey.pem"
echo "./kubectl create secret tls rag-evaluation-tls \
  --cert=/etc/letsencrypt/live/editor-rag-evaluation.c7pixel.com/fullchain.pem \
  --key=/etc/letsencrypt/live/editor-rag-evaluation.c7pixel.com/privkey.pem"
echo "./kubectl create secret tls app-client-tls \
  --cert=/etc/letsencrypt/live/demo.c7pixel.com/fullchain.pem \
  --key=/etc/letsencrypt/live/demo.c7pixel.com/privkey.pem"

echo "4 apply `kubernetes-config.yml`:"
echo "./kubectl apply -f ./kubernetes-config.yml"
