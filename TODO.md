# TODOs for the project
## UI/UX
1. Beautify interface
2. Implement avatar support
## Cybersecurity
1. Implement SSH-based encryption/decryption in transmission
Client 1    => encrypt with pubcert_s   => Server       => decrypt with privcert_s  => encrypt with pubcert_2   => Client 2     => decrypt with privcert2
plaintext   => ciphertext               => ciphertext   => plaintext                => ciphertext               => ciphertext   => plaintext
Clients need to have server's pubcert,
Server needs to contain pubcerts of each client,
