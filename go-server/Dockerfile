FROM appditto/libvips:latest as builder

WORKDIR /root

# add source code
ADD . .
# Build
RUN go build -o /root/app

FROM ubuntu:22.04

COPY --from=builder /root/app /usr/local/bin/app

ENV MALLOC_ARENA_MAX=2

# Install libvips
RUN apt-get update && apt-get install -y \
  libvips-dev \
  && rm -rf /var/lib/apt/lists/*

# run main.go
CMD ["app"]