### Task 1: VIN Validation
- I implemented VIN length validation in the backend.
- The system accepts only 17-character VINs.
- Invalid VINs return an error message before processing.

---

### Task 2: VIN Decoding Integration
- I integrated the NHTSA VIN Decoding API.
- Vehicle details such as Make, Model, and Year are fetched using VIN.
- This ensures real and verified vehicle information.

---

### Task 3: Market Price Calculation
- I implemented logic to calculate fair market price.
- Luxury and non-luxury vehicles are handled separately.
- Depreciation logic is applied based on vehicle age.

---

### Task 4: Deal Comparison Logic
- I compared contract price with market price.
- Price difference and percentage are calculated.
- The system classifies the deal as:
  - Great Deal
  - Fair Deal
  - Bad Deal

---

### Task 5: Performance Optimization
- I used LRU cache to store recently decoded VIN data.
- This reduces repeated API calls.
- Improves response time and backend efficiency.

---

### Task 6: API Endpoint Implementation
- I implemented `/market-info/{vin}` API endpoint.
- The endpoint returns:
  - Vehicle details
  - Market price
  - Contract price comparison
  - Deal rating
