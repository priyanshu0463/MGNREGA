# Finding MGNREGA Dataset on data.gov.in

## 🔍 What to Search For

### Option 1: Direct Search Terms

On https://data.gov.in/, search for:

1. **"MGNREGA district wise"** or
2. **"MGNREGA monthly"** or
3. **"Mahatma Gandhi National Rural Employment Guarantee Act"** or
4. **"MGNREGA person days"** or
5. **"District-wise MGNREGA"**

### Option 2: Browse Categories

Navigate to:
- **Categories** → **Rural Development** or
- **Categories** → **Labour and Employment** or
- **Ministry** → **Ministry of Rural Development**

## 📊 What Dataset to Look For

You need a dataset that contains **district-wise monthly data** with these fields:

✅ **Required Fields:**
- `state_name` or `state`
- `district_name` or `district`
- `year` or `financial_year`
- `month`
- `persondays` or `person_days` or `total_person_days`
- `total_households_worked` or `households_worked`
- `avg_days_per_household` or `average_days_of_employment_provided_per_household`
- `wages_lakhs` or `total_exp_rs__in_lakhs__` or `wages_disbursed`
- `women_persondays` or `women_person_days`

## 🎯 Specific Dataset Names to Look For

Look for datasets with names like:

1. **"District-wise Monthly Performance under MGNREGA"**
2. **"MGNREGA District-wise Monthly Report"**
3. **"District-wise MGNREGA Monthly Statistics"**
4. **"MGNREGA Monthly Performance Data District-wise"**

## 📝 How to Get the Resource ID

1. **Find the Dataset:**
   - Search on data.gov.in
   - Click on the dataset that looks right

2. **Get Resource ID:**
   - Open the dataset page
   - Look for **"Resource ID"** or **"API Resource ID"**
   - It's usually a long number like: `1234567890-abcdef-1234-5678-abcdef123456`
   - Or sometimes just a number: `123456`

3. **Check API Access:**
   - Look for **"API"** or **"REST API"** button/tab
   - Verify the dataset has API access enabled
   - Note the API endpoint structure

## 🔑 Getting Your API Key

1. **Sign up/Login:**
   - Go to https://data.gov.in/
   - Create account or login

2. **Get API Key:**
   - Go to **Profile** → **API Keys** or **My Profile**
   - Click **"Generate API Key"** or **"Request API Key"**
   - Copy the API key

## 📋 Example Dataset Information

**Common Dataset Names:**
- "District-wise Monthly Performance under Mahatma Gandhi National Rural Employment Guarantee Act (MGNREGA)"
- Published by: **Ministry of Rural Development**
- Updated: Monthly
- Format: JSON/CSV

**Typical Resource Structure:**
```
Resource 1: District-wise monthly person days
Resource 2: District-wise monthly households
Resource 3: District-wise monthly wages
```

You may need to use the main resource that contains all fields combined.

## 🛠️ Using the datagovindia Python Package

If you have trouble finding the Resource ID, you can search programmatically:

```python
from datagovindia import DataGovIndia

# Initialize
datagov = DataGovIndia(api_key="your-api-key")

# Search for MGNREGA datasets
results = datagov.search_datasets("MGNREGA district")
for result in results:
    print(f"Title: {result['title']}")
    print(f"Resource ID: {result['resource_id']}")
    print(f"Description: {result['description']}")
    print("---")
```

## 📌 What to Look For in Dataset Description

Good dataset descriptions mention:
- ✅ "District-wise"
- ✅ "Monthly" data
- ✅ Fields like: person-days, households, wages
- ✅ Covers multiple states (for UP)
- ✅ Recent data (2023-2024)

## ⚠️ Important Notes

1. **Resource ID Format:**
   - Can be UUID format: `abc123-def456-...`
   - Or simple number: `123456`
   - Use exactly as shown

2. **API Endpoint:**
   - Base URL: `https://api.data.gov.in/resource/{RESOURCE_ID}`
   - You'll use this in the `DATAGOV_RESOURCE_ID` env variable

3. **Field Mapping:**
   - Field names may vary between datasets
   - You may need to adjust `backend/app/ingest.py` to map fields correctly
   - Check the actual API response structure

## 🔍 Alternative: Manual Data Entry

If you can't find the right dataset:
1. Download CSV/Excel from data.gov.in
2. Parse and insert manually into database
3. Or adjust the ingestion script to match available dataset format

## 📞 If You Can't Find It

Try these alternative searches:
- "Rural Employment Guarantee"
- "NREGA" (old name)
- "Employment Guarantee Scheme district"
- "Rural Development district data"

---

## ✅ Quick Checklist

- [ ] Searched data.gov.in for "MGNREGA district"
- [ ] Found dataset with district-wise monthly data
- [ ] Noted the Resource ID
- [ ] Verified dataset has API access
- [ ] Got API key from profile
- [ ] Ready to configure `.env` file

---

**Once you have the Resource ID and API Key, add them to your `.env` file:**
```
DATAGOV_KEY=your_api_key_here
DATAGOV_RESOURCE_ID=your_resource_id_here
```

