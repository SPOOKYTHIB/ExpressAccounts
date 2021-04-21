# ExpressAccounts
Une application simple qui permet de s'inscrire, se connecter, et accéder à une page seulement en étant connecté.

# Prérequis

Vous aurez besoin d'avoir **Node.js** installé sur votre ordinateur. Téléchargez-le depuis le [site officiel](https://nodejs.org/fr/) si nécessaire.

# Installation

Ouvrez simplement la racine du projet dans un terminal et entrez `npm install`. Cette commande téléchargera toutes les dépendances nécessaires au bon fonctionnement de l'application, à condition que **Node.js** soit installé. Quelques avertissements appraîtront peut-être ; ignorez-les, ils ne poseront pas de problème.

Ensuite, entrez `npm start` et vous aurez accès à l'application à l'adresse [localhost:3000](http://localhost:3000).

# Comment utiliser

Essayez simplement de vous inscrire, puis connectez-vous en utilisant les identifiants que vous venez de créer. Ensuite, essayez d'accéder à la page "restricted". Si vous êtes connecté, vous y aurez accès. Ensuite, attendez une minute puis essayez d'y accéder de nouveau ; l'accès devrait vous être refusé.

# Comment cela fonctionne / Aspect technique

*Express Accounts* utilise le framework **Express.js** pour créer des routes (avec **PUG** pour les templates HTML), ainsi que **Node.js** pour le côté serveur.

Lorsque l'utilisateur clique sur un bouton dans un formulaire, il accède à une route **POST** qui récupère les informations entrées et vérifie le contenu du fichier `user.json`, et écrit dedans dans le cas de la route **create**. Au moment de la connexion, un token JWT est créé et enregistré sous forme de cookie..

Ensuite, en essayant d'accéder à la route "restricted", l'application vérifie si le token est valide, et si oui, l'accès est permis. Si l'utilisateur n'est pas connecté, ou si le token a expiré (il expire au bout d'une minute), un message d'erreur est affiché.

## Comment cela pourrait être amélioré

La partie inscription de l'application pourrait être améliorée en vérifiant si l'email entré contient un "@" et un ".", et si le pseudo ou l'email sont déjà utilisés. Ce sont des fonctionnalités que j'ai essayé d'implémenter, mais l'aspect asynchrone des fonctions `fs.readFile` et `fs.writeFile` m'a empêché de le faire.

Cet aspect asynchrone m'a aussi empêché d'implémenter le test unitaire. J'ai tout de même laissé ce que j'ai essayé de faire (simuler une inscription et une connexion et vérifier si le token est valide) dans les fichiers `test.js` et `testFile.js`, mais ça ne fonctionne pas. Vous pouvez vérifier le résultat du test en entrant `npm run test` dans un terminal.

J'aimerais aussi améliorer le design général de l'application et le rendre un peu plus intuitif et user-friendly. Pour le moment, cependant, je pense qu'il est tout de même plutôt facile à utiliser et à comprendre.

## Combien de temps cela a pris ?

Je dirais que j'ai eu besoin de six ou sept heures pour créer l'application telle qu'elle est maintenant. J'ai dû mettre en place le fichier JSON au lieu d'utiliser une base de données, et les fonctions `fs` m'ont compliqué la tâche. J'ai aussi dû travailler plus avec les routes, chose que je n'ai pas l'habitude de faire en JavaScript.

## Conclusion

Ce projet m'a permis d'améliorer mes compétences en Express et en routes, ainsi que pour récupérer et écrire des données depuis / vers un fichier / le navigateur. C'était très intéressant pour moi de mettre un place un système d'inscription / de connexion, étant donné que je ne l'avais pas encore fait en JS !