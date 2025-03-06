FROM postgres:latest

ENV POSTGRES_USER=postgres
ENV POSTGRES_PASSWORD=test
ENV POSTGRES_DB=bookClub

COPY backup.dump /backup.dump

CMD ["bash", "-c", "docker-entrypoint.sh postgres & sleep 5 && pg_restore -U $POSTGRES_USER -d $POSTGRES_DB /backup.dump && wait"]