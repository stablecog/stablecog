FROM appditto/libvips:latest as builder

WORKDIR /root

# add source code
ADD . .
# Build
RUN go build -o /root/app

FROM appditto/libvips:latest

COPY --from=builder /root/app /usr/local/bin/app

ENV MALLOC_ARENA_MAX=2

# run main.go
CMD ["app"]