# Global Engineering Standards

## General principles

- Prefer simple, maintainable solutions.
- Understand existing code before changing it.
- Avoid unnecessary abstractions and dependencies.
- Follow established project conventions.
- Use strong typing.
- Consider security and performance.

## Development workflow

1. Understand the task and acceptance criteria.
2. Inspect the relevant code.
3. Identify dependencies and risks.
4. Create a plan when the task is non-trivial.
5. Implement the smallest complete solution.
6. Run relevant tests and checks.
7. Report changes and remaining risks.

## Agent delegation

- The main agent owns the complete task.
- Delegate only independent, meaningful work.
- Prefer parallel investigation before parallel implementation.
- Give each subagent a clear scope and expected output.
- Avoid assigning overlapping file modifications.
- Do not delegate trivial tasks.
- Do not create agents merely to simulate organizational roles.
- The main agent must integrate and verify all results.

## Safety

- Never expose secrets.
- Never commit or push without permission.
- Never overwrite unrelated user changes.
- Ask before destructive operations.
