@description('Name of the Azure AI Search service.')
param serviceName string

@description('Location for the search service.')
param location string

resource searchService 'Microsoft.Search/searchServices@2023-11-01' = {
  name: serviceName
  location: location
  sku: {
    name: 'free'
  }
  properties: {
    replicaCount: 1
    partitionCount: 1
    hostingMode: 'default'
    publicNetworkAccess: 'enabled'
  }
}

output endpoint string = 'https://${serviceName}.search.windows.net'
output serviceName string = searchService.name
