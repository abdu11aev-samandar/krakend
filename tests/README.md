# Test Scripts

This directory contains helper scripts for validating the flexible
configuration used in this repository.

Run the template validation with:

```bash
./validate_template.sh
```

The script runs `krakend check` with the same environment variables
used in the examples and exits with the status returned by `krakend`.
