/**
 * Program IDL in camelCase format in order to be used in JS/TS.
 *
 * Note that this is only a type helper and is not the actual IDL. The original
 * IDL can be found at `target/idl/aeroscan.json`.
 */
export type Aeroscan = {
  "address": "4hPt4QcF4ozzPFaT15BRVak27TLdxXQM2rwtaWdJ8oUn",
  "metadata": {
    "name": "aeroscan",
    "version": "0.1.0",
    "spec": "0.1.0",
    "description": "Created with Anchor"
  },
  "instructions": [
    {
      "name": "createAirQualityRecord",
      "discriminator": [
        235,
        167,
        73,
        176,
        131,
        23,
        158,
        76
      ],
      "accounts": [
        {
          "name": "signer",
          "writable": true,
          "signer": true
        },
        {
          "name": "airQualityRecord",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  97,
                  105,
                  114,
                  95,
                  113,
                  117,
                  97,
                  108,
                  105,
                  116,
                  121,
                  95,
                  114,
                  101,
                  99,
                  111,
                  114,
                  100
                ]
              },
              {
                "kind": "account",
                "path": "signer"
              },
              {
                "kind": "arg",
                "path": "timestamp"
              }
            ]
          }
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        }
      ],
      "args": [
        {
          "name": "timestamp",
          "type": "i64"
        },
        {
          "name": "aqi",
          "type": "u8"
        },
        {
          "name": "pinataCid",
          "type": "string"
        }
      ]
    }
  ],
  "accounts": [
    {
      "name": "airQualityRecord",
      "discriminator": [
        181,
        220,
        63,
        80,
        125,
        247,
        235,
        4
      ]
    }
  ],
  "types": [
    {
      "name": "airQualityRecord",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "timestamp",
            "type": "i64"
          },
          {
            "name": "aqi",
            "type": "u8"
          },
          {
            "name": "pinataCid",
            "type": "string"
          },
          {
            "name": "owner",
            "type": "pubkey"
          }
        ]
      }
    }
  ]
};
