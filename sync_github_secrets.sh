while IFS= read -r line; do
  key=$(echo $line | cut -d '=' -f 1)
  value=$(echo $line | cut -d '=' -f 2-)
  gh secret set "$key" -b"$value" -R stablecog/stablecog
done < .env