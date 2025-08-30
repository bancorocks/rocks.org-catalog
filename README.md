# Banco Rocks - Organization Catalog

This repository contains the **Backstage Catalog files** (YAML entities) for the **Banco Rocks** organization.

## Entity Summary

| File | Kind | Entities | Description |
|------|------|----------|-------------|
| [`catalog-info.yaml`](catalog/catalog-info.yaml) | Location | 1 | Root location pointing to other catalog files |
| [`org.yaml`](catalog/org.yaml) | Group | 1 | Banco Rocks Organization |
| [`domains.yaml`](catalog/domains.yaml) | Domain | 2 | Banking and Marketing Domains |
| [`systems.yaml`](catalog/systems.yaml) | System | 2 | Accounts and Marketing Systems |
| [`groups.yaml`](catalog/groups.yaml) | Group | 3 | Teams (Banking, Marketing, Platform) |
| [`users.yaml`](catalog/users.yaml) | User | 2 | Example users with their group memberships |

## Repository Structure (catalog/)
```
catalog-info.yaml        # Root Location referencing other files
org.yaml                 # Group (organization)
domains.yaml             # Domains (e.g. banking, marketing)
systems.yaml             # Systems with their owners/domains
groups.yaml              # Teams (Groups type=team)
users.yaml               # Users and memberships
components/              # Component entities (services, websites, libs)
apis/                    # API entities (openapi/graphql/asyncapi)
resources/               # Resource entities (db, buckets, etc.)
```

## Quick Start

### Prerequisites
- Node.js >= 18.0.0
- Yarn >= 1.22.0

### Installation
```bash
# Clone the repository
git clone https://github.com/bancorocks/rocks.org-catalog.git
cd rocks.org-catalog

# Install dependencies
yarn install
```

### Available Commands
```bash
yarn catalog:validate    # Validate all catalog entities
yarn yaml:lint           # Lint YAML files with ESLint  
yarn lint                # Run all validation and linting checks
yarn test                # Run complete test suite
yarn ci                  # CI/CD validation command
```

The repository includes pre-commit hooks via Husky that automatically validate entities and fix formatting issues.

## Registration in Backstage

There are two ways to register this catalog:

1. **Via Backstage UI**:
   - Navigate to the Catalog page
   - Click "REGISTER ENTITY"
   - Enter the URL to `./catalog-info.yaml`
   - Click "ANALYZE"
   - Review and confirm the entities to be added

2. **Via app-config.yaml**:
   ```yaml
   catalog:
     locations:
       - type: url
         target: https://github.com/bancorocks/rocks.org-catalog/blob/main/catalog-info.yaml
   ```

## Development Workflow

### Basic Usage
1. Add or modify YAML files in the appropriate `catalog/` subdirectory
2. Run `yarn lint` to validate changes
3. Commit changes (validation runs automatically via pre-commit hooks)

## Conventions and Best Practices

### Entity Naming
- Use `kebab-case`, lowercase, DNS-safe format for `metadata.name`
- Provide clear `metadata.title` and `metadata.description`
- Add relevant `metadata.tags` for filtering and grouping

### Lifecycle Values
- `experimental`: New or proof of concept
- `production`: Production-ready and supported  
- `deprecated`: Being phased out

### Entity References
Use format: `[kind]:[namespace]/[name]`
- Groups: `group:default/team-name`
- Systems: `system:default/accounts`
- APIs: `api:default/user-api`



## Validation

Use the included validation tools:

```bash
yarn lint              # Run all validation checks
yarn catalog:validate  # Validate entity schemas only
```

This checks for required fields, valid references, naming conventions, and relationship validity.

## Entity Examples

### Component (Service)
```yaml
apiVersion: backstage.io/v1alpha1
kind: Component
metadata:
  name: user-service
  title: User Service
  description: Manages user accounts and authentication
spec:
  type: service
  lifecycle: production
  owner: group:default/platform-team
  system: system:default/accounts
  providesApis:
    - api:default/user-api
```

### API
```yaml
apiVersion: backstage.io/v1alpha1
kind: API
metadata:
  name: user-api
  description: User management API
spec:
  type: openapi
  lifecycle: production
  owner: group:default/platform-team
  definition:
    $text: |
      openapi: "3.0.0"
      info:
        title: User API
        version: "1.0.0"
```

### Resource
```yaml
apiVersion: backstage.io/v1alpha1
kind: Resource
metadata:
  name: user-database
  description: Primary user data store
spec:
  type: database
  owner: group:default/platform-team
  system: system:default/accounts
```



## Resources

For detailed information:
- [Backstage Descriptor Format](https://backstage.io/docs/features/software-catalog/descriptor-format/)
- [Entity References](https://backstage.io/docs/features/software-catalog/references/)
- [Contributing Guidelines](CONTRIBUTING.md)