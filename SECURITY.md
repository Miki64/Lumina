# Sécurité / Security Policy

## Données de santé

Ce projet est un **démonstrateur pédagogique** et ne doit pas être utilisé en production avec de vraies données de santé sans audit de sécurité préalable et certification HDS.

**Pour signaler une vulnérabilité de sécurité**, ne pas ouvrir une issue publique. Contacter directement : security@medworkspace.fr

## Bonnes pratiques implémentées

- Aucune donnée n'est transmise vers un serveur tiers
- Les données restent exclusivement en mémoire côté client (localStorage optionnel)
- Les liens de partage confrère sont simulés (aucune donnée réellement envoyée)
