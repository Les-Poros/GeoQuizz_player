# GeoQuizz_player

Membres du projet :
- Maeva Butaye    ( Lilychaan )
- Camille Schwarz ( S-Camille )
- Léo Galassi     ( ElGitariste )
- Quentin Rimet   ( QuentinRimet )

# Prérequis :

* Maven
* Docker
* Docker-compose

# Pour récupérer le player

* Cloner le dépôt soit :
    - via SSH : git clone git@github.com:Les-Poros/GeoQuizz_player.git
    - via HTTPS : git clone https://github.com/Les-Poros/GeoQuizz_player.git
    
# Pour lancer le player

* mvn clean install -DskipTests
* docker-compose up --build -d

Celui ci sera alors accessible sur le port 8082 de votre adresse docker
