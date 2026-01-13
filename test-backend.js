// Test if backend API is deployed correctly
const BASE_URL = "https://khilao-com.onrender.com"

async function testBackendAPI() {
    console.log("🧪 Testing Backend API...\n")
    
    // Test 1: Check if server is running
    try {
        const response = await fetch(`${BASE_URL}/recipe`)
        console.log("✅ Test 1: Server is running")
        console.log(`   Status: ${response.status}`)
    } catch (error) {
        console.log("❌ Test 1: Server is NOT running")
        console.log(`   Error: ${error.message}`)
        return
    }
    
    // Test 2: Check auth error handling (no token)
    try {
        const formData = new FormData()
        formData.append('title', 'Test')
        formData.append('time', '30min')
        formData.append('ingredients', 'test ingredient')
        formData.append('instructions', 'test instructions')
        
        const response = await fetch(`${BASE_URL}/recipe`, {
            method: 'POST',
            body: formData
        })
        
        const data = await response.json()
        
        if (response.status === 401 || response.status === 400) {
            console.log("✅ Test 2: Auth middleware working (requires token)")
            console.log(`   Status: ${response.status}`)
            console.log(`   Response: ${JSON.stringify(data)}`)
        } else {
            console.log("⚠️  Test 2: Auth middleware may not be updated")
            console.log(`   Status: ${response.status}`)
            console.log(`   Response: ${JSON.stringify(data)}`)
        }
    } catch (error) {
        console.log("❌ Test 2: Error testing auth")
        console.log(`   Error: ${error.message}`)
    }
    
    console.log("\n📝 Summary:")
    console.log("   If you see ✅ for both tests, backend is deployed correctly")
    console.log("   If you see HTML response instead of JSON, backend needs to be redeployed")
}

testBackendAPI()
