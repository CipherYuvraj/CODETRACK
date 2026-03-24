#!/bin/bash
# Complete CodeTrack API Test Suite
# Paste this in terminal after running: npm start

echo "=========================================="
echo "CodeTrack API - Full Test Suite"
echo "=========================================="
echo ""

# Test 1: Server Health Check
echo "1️⃣  Testing server health..."
curl http://localhost:5000/
echo -e "\n"

# Test 2: Add question 1
echo "2️⃣  Adding question 1 (Two Sum)..."
curl -X POST http://localhost:5000/api/question \
  -H "Content-Type: application/json" \
  -d '{"name":"Two Sum","topic":"arrays","difficulty":"easy","username":"john"}'
echo -e "\n"

# Test 3: Add question 2
echo "3️⃣  Adding question 2 (Longest Substring)..."
curl -X POST http://localhost:5000/api/question \
  -H "Content-Type: application/json" \
  -d '{"name":"Longest Substring","topic":"strings","difficulty":"medium","username":"john"}'
echo -e "\n"

# Test 4: Add question 3
echo "4️⃣  Adding question 3 (Fibonacci)..."
curl -X POST http://localhost:5000/api/question \
  -H "Content-Type: application/json" \
  -d '{"name":"Fibonacci","topic":"dp","difficulty":"easy","username":"john"}'
echo -e "\n"

# Test 5: Add question 4
echo "5️⃣  Adding question 4 (Binary Search)..."
curl -X POST http://localhost:5000/api/question \
  -H "Content-Type: application/json" \
  -d '{"name":"Binary Search","topic":"arrays","difficulty":"medium","username":"john"}'
echo -e "\n"

# Test 6: Get stats
echo "6️⃣  Getting stats..."
curl http://localhost:5000/api/stats
echo -e "\n"

# Test 7: Get today's revisions
echo "7️⃣  Getting today's revisions..."
curl http://localhost:5000/api/revision
echo -e "\n"

# Test 8: Bookmark question 1
echo "8️⃣  Bookmarking question 1..."
curl -X POST http://localhost:5000/api/bookmark/1
echo -e "\n"

# Test 9: Add notes to question 2
echo "9️⃣  Adding notes to question 2..."
curl -X PATCH http://localhost:5000/api/bookmark/2 \
  -H "Content-Type: application/json" \
  -d '{"notes":"Use sliding window technique"}'
echo -e "\n"

# Test 10: Get bookmarks
echo "🔟 Getting all bookmarks..."
curl http://localhost:5000/api/bookmark
echo -e "\n"

# Test 11: Mark revision complete
echo "1️⃣1️⃣ Marking day3 revision complete for question 1..."
curl -X PATCH http://localhost:5000/api/revision/1 \
  -H "Content-Type: application/json" \
  -d '{"phase":"day3"}'
echo -e "\n"

# Test 12: Get john's portfolio
echo "1️⃣2️⃣ Getting john's portfolio..."
curl http://localhost:5000/api/user/john
echo -e "\n"

# Test 13: Add question for another user
echo "1️⃣3️⃣ Adding question for different user (sarah)..."
curl -X POST http://localhost:5000/api/question \
  -H "Content-Type: application/json" \
  -d '{"name":"Graph DFS","topic":"graphs","difficulty":"hard","username":"sarah"}'
echo -e "\n"

# Test 14: Get sarah's portfolio
echo "1️⃣4️⃣ Getting sarah'\''s portfolio..."
curl http://localhost:5000/api/user/sarah
echo -e "\n"

echo "=========================================="
echo "✅ All tests completed!"
echo "=========================================="
