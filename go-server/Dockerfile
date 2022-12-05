FROM golang:1.18.2-bullseye AS build

WORKDIR /go/src/stablecog-go

# Copy all the Code and stuff to compile everything
COPY . .

# Downloads all the dependencies in advance (could be left out, but it's more clear this way)
RUN go mod download
RUN add-apt-repository -y ppa:strukturag/libde265
RUN add-apt-repository -y ppa:strukturag/libheif
RUN add-apt-repository ppa:tonimelisma/ppa
RUN apt -y install -y musl-dev libvips-dev gcc

# Builds the application as a staticly linked one, to allow it to run on alpine
RUN CGO_ENABLED=0 GOOS=linux GOARCH=amd64 go build -a -installsuffix cgo -o app .

# Moving the binary to the 'final Image' to make it smaller
FROM golang:1.18.2-bullseye
WORKDIR /app

COPY --from=build /go/src/stablecog-go/app .
RUN apt -y install libvips-dev

CMD ["./app"]