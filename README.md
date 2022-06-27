# commentcov-plugin-typescript

[commentcov-plugin-typescript](https://github.com/commentcov/commentcov-plugin-typescript) is the [commentcov](https://github.com/commentcov/commentcov) plugin for typescript

## How to use

Specify plugin info on your commentcov configuraiton (default is `<path_to_project>/.commentcov.yaml`).

```bash
$ pwd
/home/commentcov/workspace/github.com/withastro/astro

$ cat .commentcov.yaml
plugins:
  - extension: .ts
    install_command: pnpm add -w -r @commentcov/commentcov-plugin-typescript
    execute_command: ./node_modules/.bin/commentcov-plugin-typescript
target_path: .
exclude_paths:
  - ./assets/**/**
  - ./examples/**/**
  - ./node_modules/**/**
mode: scope
```

Then, run commentcov. You could get the comment coverage of the `.ts` files in csv format.
```bash
$ commentcov coverage
{"@level":"info","@message":"Install Plugin","@module":"commentcov","@timestamp":"2022-06-27T21:17:13.395952+09:00","plugin":"commentcov-plugin-for-ts"}
{"@level":"debug","@message":"starting plugin","@module":"commentcov","@timestamp":"2022-06-27T21:17:15.432655+09:00","args":["./node_modules/.bin/commentcov-plugin-typescript"],"path":"./node_modules/.bin/commentcov-plugin-typescript"}
{"@level":"debug","@message":"plugin started","@module":"commentcov","@timestamp":"2022-06-27T21:17:15.432942+09:00","path":"./node_modules/.bin/commentcov-plugin-typescript","pid":412483}
{"@level":"debug","@message":"waiting for RPC address","@module":"commentcov","@timestamp":"2022-06-27T21:17:15.432980+09:00","path":"./node_modules/.bin/commentcov-plugin-typescript"}
{"@level":"debug","@message":"using plugin","@module":"commentcov","@timestamp":"2022-06-27T21:17:15.855580+09:00","version":1}
{"@level":"trace","@message":"waiting for stdio data","@module":"commentcov.stdio","@timestamp":"2022-06-27T21:17:15.858041+09:00"}
{"@level":"debug","@message":"received EOF, stopping recv loop","@module":"commentcov.stdio","@timestamp":"2022-06-27T21:17:22.686884+09:00","err":"rpc error: code = Unimplemented desc = The server does not implement the method /plugin.GRPCStdio/StreamStdio"}
,PRIVATE_CLASS,1.3888888888888888
,PRIVATE_FUNCTION,10.472972972972974
,PRIVATE_MODULE,9.090909090909092
,PRIVATE_VARIABLE,21.96969696969697
,PUBLIC_CLASS,13.076923076923077
,PUBLIC_FUNCTION,28.617363344051448
,PUBLIC_VARIABLE,28.26086956521739
{"@level":"warn","@message":"plugin failed to exit gracefully","@module":"commentcov","@timestamp":"2022-06-27T21:17:28.703038+09:00"}
{"@level":"error","@message":"plugin process exited","@module":"commentcov","@timestamp":"2022-06-27T21:17:28.739772+09:00","error":"signal: killed","path":"./node_modules/.bin/commentcov-plugin-typescript","pid":412483}
```

## Commentcov CoverageItem Scope Mapping

The mapping from the type of Typescript code comment to the CoverageItem Scope is below.

| Scope Name                    | Typescript Node                      |
|-------------------------------|--------------------------------------|
| CoverageItem_UNKNOWN          | N/A                                  |
| CoverageItem_FILE             | N/A                                  |
| CoverageItem_PUBLIC_MODULE    | Exported Module/Namespace            |
| CoverageItem_PRIVATE_MODULE   | Unexported Module/Namespace          |
| CoverageItem_PUBLIC_CLASS     | Exported Class/Interface Comment     |
| CoverageItem_PRIVATE_CLASS    | Unexported Class/Interface Comment   |
| CoverageItem_PUBLIC_TYPE      | N/A                                  |
| CoverageItem_PRIVATE_TYPE     | N/A                                  |
| CoverageItem_PUBLIC_FUNCTION  | Exported Function Comment            |
| CoverageItem_PRIVATE_FUNCTION | Unexported Function Comment          |
| CoverageItem_PUBLIC_VARIABLE  | Exported Let, Const Comment          |
| CoverageItem_PRIVATE_VARIABLE | Unexported Let, Const Comment        |

