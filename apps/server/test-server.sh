#!/bin/bash

# =======================================================
# SERVER TESTING SCRIPT
# =======================================================

BASE_URL="http://localhost:3000"

echo "🚀 Testing Server Endpoints..."
echo "========================================"

# Function to print test results
print_test() {
    echo -e "\n📋 $1"
    echo "----------------------------------------"
}

# Function to print response
print_response() {
    echo "📤 Response:"
    echo "$1"
    echo ""
}

# 1. Basic health check
print_test "1. Basic Health Check"
RESPONSE=$(curl -s "$BASE_URL/")
print_response "$RESPONSE"

# 2. Detailed health check
print_test "2. Detailed Health Check (Database Status)"
RESPONSE=$(curl -s -H "Accept: application/json" "$BASE_URL/health" | jq .)
print_response "$RESPONSE"

# 3. Test 404 endpoint
print_test "3. Testing 404 Endpoint"
RESPONSE=$(curl -s -w "HTTP Status: %{http_code}\n" "$BASE_URL/non-existent")
print_response "$RESPONSE"

# 4. Test CORS preflight
print_test "4. Testing CORS Preflight"
RESPONSE=$(curl -s -I -X OPTIONS \
  -H "Origin: http://localhost:3000" \
  -H "Access-Control-Request-Method: POST" \
  -H "Access-Control-Request-Headers: Content-Type, Authorization" \
  "$BASE_URL/api/auth/sign-in")
print_response "$RESPONSE"

# 5. Test Auth Sign Up
print_test "5. Testing Auth Sign Up"
RESPONSE=$(curl -s -X POST \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "testpassword123",
    "name": "Test User"
  }' \
  "$BASE_URL/api/auth/sign-up")
print_response "$RESPONSE"

# 6. Test Auth Sign In
print_test "6. Testing Auth Sign In"
RESPONSE=$(curl -s -X POST \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "testpassword123"
  }' \
  "$BASE_URL/api/auth/sign-in")
print_response "$RESPONSE"

# 7. Test multiple rapid requests for connection pooling
print_test "7. Testing Connection Pooling (5 rapid requests)"
for i in {1..5}; do
    echo "Request $i:"
    RESPONSE=$(curl -s -w "Time: %{time_total}s\n" "$BASE_URL/health" | jq -r '.connectionPool')
    echo "Pool Status: $RESPONSE"
done

# 8. Test error handling with malformed JSON
print_test "8. Testing Error Handling (Malformed JSON)"
RESPONSE=$(curl -s -X POST \
  -H "Content-Type: application/json" \
  -d '{"invalid": "json", "missing":}' \
  "$BASE_URL/api/auth/sign-in")
print_response "$RESPONSE"

echo "========================================"
echo "✅ Testing completed!"
echo "💡 Tip: Make sure server is running with 'bun run dev'"
echo "🔍 Check server logs to see detailed logging output" 
