#!/bin/bash

# This script creates an rclone configuration file based on environment variables.
# It ensures the necessary configuration directory exists and then writes the
# config for a Cloudflare R2 remote.

# Exit immediately if a command exits with a non-zero status.
set -e

# --- Configuration ---
# The name for the new rclone remote.
REMOTE_NAME="r2"

# The standard path for the rclone configuration file.
RCLONE_CONFIG_FILE="$HOME/.config/rclone/rclone.conf"

# --- Pre-flight Checks ---
# Check if the essential environment variables are set.
if [ -z "$RCLONE_TYPE" ] || [ -z "$RCLONE_PROVIDER" ] || \
   [ -z "$RCLONE_ACCESS_KEY_ID" ] || [ -z "$RCLONE_SECRET_ACCESS_KEY" ] || \
   [ -z "$RCLONE_ENDPOINT" ] || [ -z "$RCLONE_ACL" ]; then
    echo "Error: One or more required RCLONE environment variables are not set." >&2
    echo "Please ensure all of the following are exported:" >&2
    echo "  - RCLONE_TYPE" >&2
    echo "  - RCLONE_provider" >&2
    echo "  - RCLONE_ACCESS_KEY_ID" >&2
    echo "  - RCLONE_SECRET_ACCESS_KEY" >&2
    echo "  - RCLONE_ENDPOINT" >&2
    echo "  - RCLONE_ACL" >&2
    exit 1
fi

# --- Script Body ---
echo "Creating rclone config directory..."
# Create the rclone config directory if it doesn't exist.
mkdir -p "$(dirname "$RCLONE_CONFIG_FILE")"

echo "Writing rclone configuration to $RCLONE_CONFIG_FILE..."
# Create the rclone.conf file using a "here document".
# This will overwrite any existing configuration for a remote with the same name.
cat << EOF > "$RCLONE_CONFIG_FILE"
[${REMOTE_NAME}]
type = ${RCLONE_TYPE}
provider = ${RCLONE_PROVIDER}
access_key_id = ${RCLONE_ACCESS_KEY_ID}
secret_access_key = ${RCLONE_SECRET_ACCESS_KEY}
endpoint = ${RCLONE_ENDPOINT}
acl = ${RCLONE_ACL}
EOF

echo ""
echo "✅ Rclone configuration for remote '${REMOTE_NAME}' created successfully!"
echo "You can now use rclone, for example: rclone lsd ${REMOTE_NAME}:"