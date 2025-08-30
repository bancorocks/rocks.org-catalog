# Contributing to Banco Rocks Catalog

This guide explains how to contribute to the Banco Rocks Backstage Catalog by adding or updating entity definitions. Please read it carefully before submitting changes.

## Table of Contents
- [Getting Started](#getting-started)
- [Contribution Workflow](#contribution-workflow)
- [File Organization](#file-organization)
- [Entity Guidelines](#entity-guidelines)
- [Validation and Testing](#validation-and-testing)
- [Review Process](#review-process)
- [Best Practices](#best-practices)
- [Troubleshooting](#troubleshooting)

## Getting Started

### Prerequisites
- Node.js >= 18.0.0
- Yarn >= 1.22.0
- Git
- Basic understanding of YAML syntax
- Familiarity with Backstage concepts

### Development Setup
```bash
# Fork and clone the repository
git clone https://github.com/bancorocks/rocks.org-catalog.git

cd rocks.org-catalog

# Install dependencies
yarn install

# Verify setup
yarn lint
```

## Contribution Workflow

### 1. Planning Your Contribution
Before making changes, consider:
- **What type of entity** are you adding/updating?
- **Which team/domain** owns this entity?
- **What relationships** exist with other entities?
- **Is this entity already represented** in the catalog?

### 2. Creating Your Branch
```bash
# Create and switch to feature branch
git checkout -b feature/add-user-service
# or
git checkout -b update/accounts-system-owner
# or  
git checkout -b fix/api-reference-typo
```

### 3. Making Changes
Add/update entity YAML files in the appropriate directories:

```
catalog/
├── catalog-info.yaml      # Root location (rarely modified)
├── org.yaml              # Organization entities
├── domains.yaml          # Business domains
├── systems.yaml          # System groupings
├── groups.yaml           # Teams and groups
├── users.yaml            # Individual users
├── components/           # Services, websites, libraries
│   └── your-service.yaml
├── apis/                 # API specifications  
│   └── your-api.yaml
└── resources/            # Infrastructure resources
    └── your-database.yaml
```

### 4. Local Validation
```bash
# Run all validation checks
yarn lint

# Or run individual checks
yarn yaml:lint           # YAML formatting
yarn catalog:validate    # Entity validation
```

### 5. Committing Changes
```bash
git add .
git commit -m "add(component): user-authentication-service

Add User Authentication Service component for handling 
user login, registration, and session management"
```

### 6. Submitting Pull Request
```bash
# Push to your fork
git push origin feature/add-user-service

# Create PR via GitHub UI or CLI
gh pr create --title "Add User Authentication Service" \
  --body "Adds the User Authentication Service component to the accounts system"
```

## File Organization

### Directory Structure
Place entities in the correct location based on their kind:

| Entity Kind | Directory | Purpose |
|-------------|-----------|---------|
| `Location` | `catalog/` | Root catalog references |
| `Group` (org) | `catalog/org.yaml` | Organization definition |
| `Domain` | `catalog/domains.yaml` | Business domains |
| `System` | `catalog/systems.yaml` | System groupings |
| `Group` (team) | `catalog/groups.yaml` | Teams and groups |
| `User` | `catalog/users.yaml` | Individual users |
| `Component` | `components/` | Services, websites, libraries |
| `API` | `apis/` | API specifications |
| `Resource` | `resources/` | Infrastructure resources |

### Multi-Entity Files vs Single Files
- **Core entities** (domains, systems, groups, users): Add to existing multi-entity files
- **Components, APIs, Resources**: Create individual files

## Entity Guidelines

### Naming Conventions

#### Entity Names (`metadata.name`)
- **Format**: `kebab-case`
- **Characters**: lowercase letters, numbers, hyphens only
- **DNS-safe**: Must be valid DNS subdomain
- **Unique**: Across the entire organization
- **Descriptive**: Clear purpose from the name

**Good Examples:**
```yaml
# Services
name: user-authentication-service
name: payment-processing-api
name: customer-notification-service

# APIs
name: user-management-api
name: transaction-api

# Resources
name: user-database
name: redis-cache
name: s3-documents-bucket
```

**Bad Examples:**
```yaml
name: UserService          # camelCase
name: user_service         # snake_case
name: user service         # spaces
name: Service              # too generic
name: us                   # too short/unclear
```

#### File Names
- Match the entity name exactly
- Add `.yaml` extension
- Example: `user-authentication-service.yaml`

### Required Metadata Fields

Every entity must include these core fields:

```yaml
apiVersion: backstage.io/v1alpha1
kind: Component  # Component, System, Domain, API, Resource, Group, User
metadata:
  name: entity-name                    # Required: kebab-case identifier
  title: Human Readable Title          # Required: display name
  description: |                       # Required: clear purpose description
    Detailed description of what this entity does,
    its responsibilities, and its role in the system.
  tags:                               # Recommended: for filtering/grouping
    - microservice
    - authentication
    - go
  links:                              # Recommended: relevant resources
    - url: https://github.com/org/repo
      title: Source Code
    - url: https://docs.internal.com/service
      title: Documentation
spec:
  # Kind-specific required fields (see examples below)
```

### Lifecycle Management

Use appropriate lifecycle values:

```yaml
spec:
  lifecycle: production    # Most stable, supported entities
  # OR
  lifecycle: experimental  # New, proof-of-concept, or beta
  # OR  
  lifecycle: deprecated    # Being phased out
```

### Ownership Rules

All entities (except Location and Organization) must specify an owner:

```yaml
spec:
  owner: group:default/platform-team  # Reference to a Group entity
```

**Valid Owner Formats:**
- `group:default/team-name` - Team ownership
- `user:default/username` - Individual ownership (rare)

### Entity Type Examples

#### Component (Service)
```yaml
apiVersion: backstage.io/v1alpha1
kind: Component
metadata:
  name: user-authentication-service
  title: User Authentication Service
  description: |
    Microservice responsible for user authentication, authorization,
    and session management. Provides JWT tokens and integrates with
    external identity providers.
  tags:
    - microservice
    - authentication
    - go
    - jwt
  links:
    - url: https://github.com/bancorocks/user-auth-service
      title: Source Code
    - url: https://auth-docs.bancorocks.com
      title: API Documentation
  annotations:
    github.com/project-slug: bancorocks/user-auth-service
    backstage.io/source-location: url:https://github.com/bancorocks/user-auth-service
spec:
  type: service
  lifecycle: production
  owner: group:default/platform-team
  system: system:default/accounts
  providesApis:
    - api:default/user-auth-api
  dependsOn:
    - resource:default/user-database
    - component:default/config-service
```

#### API
```yaml
apiVersion: backstage.io/v1alpha1
kind: API
metadata:
  name: user-auth-api
  title: User Authentication API
  description: REST API for user authentication and authorization
  tags:
    - rest
    - authentication
    - openapi
spec:
  type: openapi
  lifecycle: production
  owner: group:default/platform-team
  system: system:default/accounts
  definition:
    $text: |
      openapi: "3.0.0"
      info:
        title: User Authentication API
        version: "1.0.0"
        description: API for user authentication operations
      paths:
        /login:
          post:
            summary: User login
```

#### Resource
```yaml
apiVersion: backstage.io/v1alpha1
kind: Resource
metadata:
  name: user-database
  title: User Database
  description: PostgreSQL database storing user accounts and profiles
  tags:
    - database
    - postgresql
    - users
spec:
  type: database
  owner: group:default/platform-team
  system: system:default/accounts
```

## Validation and Testing

### Pre-commit Validation
The repository uses automated validation via Husky hooks:

```bash
# These run automatically on commit:
yarn yaml:lint --fix      # Fix YAML formatting
yarn catalog:validate    # Validate entity schemas
```

### Manual Validation
```bash
# Run all checks locally
yarn lint

# Individual validation steps
yarn yaml:lint           # Check YAML syntax and formatting
yarn catalog:validate    # Validate Backstage entity schemas
yarn test               # Complete test suite
```

### Common Validation Errors

**Invalid entity name:**
```bash
Error: Entity name must be kebab-case
```
**Fix:** Use lowercase with hyphens: `user-service` not `UserService`

**Missing required field:**
```bash
Error: Missing required field: spec.owner
```
**Fix:** Add owner reference: `owner: group:default/team-name`

**Invalid reference:**
```bash
Error: Referenced entity does not exist: group:default/unknown-team
```
**Fix:** Reference existing entities or create the referenced entity first

**YAML formatting:**
```bash
Error: Incorrect indentation at line 15
```
**Fix:** Run `yarn yaml:lint --fix` to auto-format

## Review Process

### Pull Request Requirements
- [ ] **Clear title** describing the change
- [ ] **Detailed description** explaining the purpose
- [ ] **Validation passes** (GitHub Actions will check)
- [ ] **Appropriate reviewers** assigned
- [ ] **Breaking changes** clearly documented

### PR Template
```markdown
## Summary
Brief description of what this PR adds/changes/fixes.

## Changes
- [ ] Added new Component: `service-name`
- [ ] Updated System: `system-name` 
- [ ] Fixed API reference in: `component-name`

## Validation
- [ ] `yarn lint` passes locally
- [ ] All entity references are valid
- [ ] No duplicate entity names

## Testing
- [ ] Entities import correctly in Backstage
- [ ] Relationships display properly
- [ ] No broken links

## Additional Notes
Any special considerations or context for reviewers.
```

### Review Criteria
Maintainers will check:

**Technical Compliance:**
- YAML syntax and formatting
- Required fields present
- Valid entity references
- Proper file organization
- Consistent naming conventions

**Content Quality:**
- Clear, helpful descriptions
- Appropriate tags and metadata
- Correct ownership assignments
- Valid lifecycle designation
- Meaningful relationships

**Documentation:**
- Useful links provided
- Annotations for tooling integration
- PR description is clear

## Best Practices

### Entity Descriptions
Write clear, actionable descriptions:

**Good:**
```yaml
description: |
  REST API for processing customer payments, including credit card 
  transactions, refunds, and payment status tracking. Integrates 
  with Stripe and internal fraud detection systems.
```

**Bad:**
```yaml
description: Payment API  # Too brief
description: API  # Too generic
```

### Tags Strategy
Use consistent, searchable tags:

**Technology tags:** `go`, `typescript`, `react`, `postgresql`
**Function tags:** `authentication`, `payment`, `notification`
**Type tags:** `microservice`, `frontend`, `api`, `database`
**Environment tags:** `production`, `staging` (if needed)

### Relationship Modeling
Model relationships accurately:

```yaml
# Service provides an API
spec:
  providesApis:
    - api:default/user-auth-api

# Service depends on resources
spec:
  dependsOn:
    - resource:default/user-database
    - component:default/config-service

# Service is part of a system
spec:
  system: system:default/accounts
```

### Link Categories
Include relevant links:

```yaml
metadata:
  links:
    - url: https://github.com/org/repo
      title: Source Code
      icon: github
    - url: https://service.bancorocks.com
      title: Live Service
      icon: web
    - url: https://docs.internal.com/service
      title: Documentation
      icon: docs
    - url: https://grafana.com/dashboard/123
      title: Monitoring Dashboard
      icon: dashboard
```

## Troubleshooting

### Common Issues and Solutions

**Entity not appearing in Backstage:**
1. Check that validation passes: `yarn lint`
2. Verify entity is referenced in a Location entity
3. Confirm entity name is unique
4. Check Backstage import logs for errors

**Broken relationships:**
1. Verify referenced entities exist
2. Use correct reference format: `kind:namespace/name`
3. Check spelling of entity names
4. Ensure circular dependencies don't exist

**Permission errors:**
1. Verify you have write access to the repository
2. Check that you're pushing to your fork
3. Ensure branch protection rules are met

**Validation failures:**
```bash
# Get detailed error information
yarn catalog:validate --verbose

# Fix YAML formatting issues
yarn yaml:lint --fix

# Check specific file
yarn catalog:validate catalog/components/your-service.yaml
```

### Getting Help

**For technical issues:**
- Check existing GitHub Issues
- Review Backstage documentation
- Ask in team Slack channels

**For process questions:**
- Contact repository maintainers
- Review this contributing guide
- Check pull request examples

## Advanced Topics

### Multi-Environment Entities
For services deployed across environments:

```yaml
# Use annotations to specify environment-specific info
metadata:
  annotations:
    deployment.env/staging: https://staging.service.com
    deployment.env/production: https://prod.service.com
    monitoring.env/production: https://grafana.com/prod-dashboard
```

### Large System Organization
For complex systems with many components:

1. **Create the System entity first**
2. **Group related components** under the system
3. **Use subcomponent relationships** for nested components:
```yaml
spec:
  subcomponentOf: component:default/parent-service
```

### API Evolution
When updating API entities:

1. **Maintain backward compatibility** when possible
2. **Update version numbers** in the definition
3. **Document breaking changes** in PR description
4. **Coordinate with API consumers** before major changes

### Bulk Updates
For large-scale changes affecting multiple entities:

1. **Plan the change** and communicate with maintainers
2. **Use consistent patterns** across all updated entities
3. **Split into logical commits** for easier review
4. **Test thoroughly** before submitting

## Entity-Specific Guidelines

### Components
- **Type field is required:** Use `service`, `website`, `library`
- **System reference:** Components should belong to a system
- **API relationships:** Specify `providesApis` and `consumesApis`
- **Dependencies:** Use `dependsOn` for hard dependencies

### APIs
- **Include definition:** Either inline or reference external spec
- **Version appropriately:** Follow semantic versioning
- **Document consumers:** Note which components consume the API
- **Specify type:** `openapi`, `graphql`, `asyncapi`, `grpc`

### Resources
- **Be specific with type:** `database`, `bucket`, `queue`, `cache`
- **Include connection info:** In annotations if appropriate
- **Document access patterns:** Who uses this resource and how

### Systems
- **Clear boundaries:** Systems should have clear responsibilities
- **Appropriate size:** Not too small (3+ components) or too large (20+ components)
- **Domain assignment:** Every system should belong to a domain

## Code Review Guidelines

### For Authors
**Before requesting review:**
- [ ] All validation passes locally
- [ ] Commit messages follow conventions
- [ ] PR description is complete
- [ ] Self-review completed
- [ ] Breaking changes documented

**During review:**
- Respond promptly to feedback
- Make requested changes in additional commits
- Re-request review after changes
- Be open to suggestions and improvements

### For Reviewers
**Review checklist:**
- [ ] Entity follows naming conventions
- [ ] All required fields present and valid
- [ ] Relationships are correct
- [ ] File organization is appropriate
- [ ] Description is clear and helpful
- [ ] Tags are relevant and consistent
- [ ] Links are valid and useful
- [ ] No security concerns (exposed secrets, etc.)

**Review process:**
1. **Automated checks pass** (GitHub Actions)
2. **Content review** (accuracy, completeness)
3. **Relationship validation** (references work correctly)
4. **Integration testing** (if significant changes)

## Commit Message Conventions

### Format
```
type(scope): summary

Optional detailed description explaining the change,
its motivation, and any breaking changes or migration notes.

Closes #123
```

### Types
- `add`: New entity creation
- `update`: Modify existing entity
- `remove`: Delete entity
- `fix`: Correct errors or issues
- `docs`: Documentation changes
- `refactor`: Reorganize without functional changes

### Scopes
Use the entity kind and name:
- `component`: For component changes
- `api`: For API changes
- `system`: For system changes
- `domain`: For domain changes
- `resource`: For resource changes

### Examples
```bash
# Adding a new service
git commit -m "add(component): payment-processor

Add Payment Processor microservice component with
Stripe integration and fraud detection capabilities"

# Updating system ownership
git commit -m "update(system): accounts-system

Transfer ownership from platform-team to banking-team
following organizational restructure"

# Fixing broken reference
git commit -m "fix(api): user-api

Fix reference to user-database resource in API dependencies"

# Removing deprecated service
git commit -m "remove(component): legacy-auth-service

Remove deprecated authentication service that has been
replaced by user-authentication-service"
```

## Security Considerations

### Sensitive Information
**Never include in catalog files:**
- Passwords or API keys
- Internal URLs or IP addresses
- Database connection strings
- Security tokens or certificates

### Public Information Only
- All catalog data is potentially visible to all Backstage users
- Use generic descriptions for internal services
- Reference public documentation and repositories
- Use annotations for tool integration, not secrets

### Annotations for Tooling
**Safe annotations:**
```yaml
metadata:
  annotations:
    github.com/project-slug: bancorocks/service-name
    backstage.io/techdocs-ref: dir:./docs
```

**Unsafe annotations:**
```yaml
metadata:
  annotations:
    # DON'T DO THIS
    database.connection/url: postgresql://user:pass@host:5432/db
    api.key: secret-api-key-here
```

## References and Resources

### Backstage Documentation
- [Descriptor Format](https://backstage.io/docs/features/software-catalog/descriptor-format/)
- [Entity References](https://backstage.io/docs/features/software-catalog/references/)
- [Well-known Annotations](https://backstage.io/docs/features/software-catalog/well-known-annotations)
- [Software Catalog Overview](https://backstage.io/docs/features/software-catalog/)

### YAML Resources
- [YAML Specification](https://yaml.org/spec/)
- [YAML Validator](https://yamlchecker.com/)
- [ESLint YAML Plugin](https://github.com/ota-meshi/eslint-plugin-yml)

### Tools
- [Entity Validator Package](https://www.npmjs.com/package/@roadiehq/backstage-entity-validator)
- [Backstage CLI](https://backstage.io/docs/local-dev/cli-overview)

## Support

**Questions about:**
- **Entity modeling:** Contact `@platform-team` in Slack
- **Domain ownership:** Contact respective domain teams
- **Repository access:** Contact `@devops-team`
- **Backstage usage:** See internal Backstage documentation

**Reporting issues:**
- **Bugs:** Create GitHub issue with reproduction steps
- **Feature requests:** Discuss in `#backstage` Slack channel first
- **Security concerns:** Contact security team directly