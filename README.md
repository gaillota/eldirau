# eldirau-private

## Backup database
`docker exec -it mongodb bash // Enter your MongoDB container`
`mongodump --db *databaseName* --gzip --archive=*archiveName* // Backup your database`
`docker cp mongodb:*archiveName* /path/to/folder/*archiveName* // Copy your archive file out of the container`

## Restore database
`docker /path/to/folder/*archiveName* mongodb:/ // Copy your backup file into your MongoDB container`
`docker exec -it mongodb bash // Enter in the container`
`mongorestore --db *databaseName* -v *yourArchiveName* // Restore your database from the archive file`
