param namePrefix string = 'docsimplify'
param uniqueSuffix string = take(uniqueString(resourceGroup().id), 5)
param location string = 'eastus'

var aiFoundryName = 'fd-${namePrefix}-${uniqueSuffix}'
var aiProjectName = 'pj-${namePrefix}-${uniqueSuffix}'
var storageAccountName = 'st${namePrefix}${uniqueSuffix}'
var cosmosAccountName = 'cosmos-${namePrefix}-${uniqueSuffix}'
var searchServiceName = 'srch-${namePrefix}-${uniqueSuffix}'
var docIntelName = 'docintel-${namePrefix}-${uniqueSuffix}'

// ── AI Foundry (AIServices) ─────────────────────────────────────────────────
resource aiFoundry 'Microsoft.CognitiveServices/accounts@2025-09-01' = {
  name: aiFoundryName
  location: location
  identity: {
    type: 'SystemAssigned'
  }
  sku: {
    name: 'S0'
  }
  kind: 'AIServices'
  properties: {
    allowProjectManagement: true
    customSubDomainName: aiFoundryName
    disableLocalAuth: false
    publicNetworkAccess: 'Enabled'
  }
}

// ── AI Project ───────────────────────────────────────────────────────────────
module aiProjectModule 'modules/project.bicep' = {
  name: 'aiProjectDeployment'
  params: {
    aiProjectName: aiProjectName
    location: location
    resourceName: aiFoundry.name
  }
}

// ── Storage Account ──────────────────────────────────────────────────────────
module storageAccountModule 'modules/storage-account.bicep' = {
  name: 'storageDeployment'
  params: {
    storageAccountName: storageAccountName
    location: location
  }
}

// ── GPT-4o-mini deployment ───────────────────────────────────────────────────
module gptModel 'modules/generative-model.bicep' = {
  name: 'gptModelDeployment'
  params: {
    resourceName: aiFoundry.name
    modelDeploymentName: 'gpt-4o-mini'
    modelName: 'gpt-4o-mini'
    modelFormat: 'OpenAI'
    modelVersion: '2024-07-18'
    skuCapacity: 10
  }
}

// ── Embedding model (text-embedding-ada-002) ─────────────────────────────────
module embeddingModel 'modules/generative-model.bicep' = {
  name: 'embeddingModelDeployment'
  params: {
    resourceName: aiFoundry.name
    modelDeploymentName: 'text-embedding-ada-002'
    modelName: 'text-embedding-ada-002'
    modelFormat: 'OpenAI'
    modelVersion: '2'
    skuCapacity: 10
  }
  dependsOn: [gptModel]
}

// ── Cosmos DB (Serverless) ───────────────────────────────────────────────────
module cosmosModule 'modules/cosmos-db.bicep' = {
  name: 'cosmosDeployment'
  params: {
    accountName: cosmosAccountName
    location: location
    databaseName: 'docsimplify'
  }
}

// ── Azure AI Search (Free) ───────────────────────────────────────────────────
module searchModule 'modules/ai-search.bicep' = {
  name: 'searchDeployment'
  params: {
    serviceName: searchServiceName
    location: location
  }
}

// ── Document Intelligence (Free F0) ─────────────────────────────────────────
module docIntelModule 'modules/document-intelligence.bicep' = {
  name: 'docIntelDeployment'
  params: {
    accountName: docIntelName
    location: location
  }
}

// ── Outputs ──────────────────────────────────────────────────────────────────
output foundryName string = aiFoundry.name
output foundryEndpoint string = aiFoundry.properties.endpoint
output aiProjectName string = aiProjectName
output storageAccountName string = storageAccountModule.outputs.storageAccountName
output cosmosEndpoint string = cosmosModule.outputs.endpoint
output cosmosAccountName string = cosmosModule.outputs.accountName
output searchEndpoint string = searchModule.outputs.endpoint
output searchServiceName string = searchModule.outputs.serviceName
output docIntelEndpoint string = docIntelModule.outputs.endpoint
output docIntelName string = docIntelModule.outputs.accountName
