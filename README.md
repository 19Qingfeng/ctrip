# trip-cli

固定模板快速创建单个 `Ui Component`:

## TODO:

增加 postPublish 后的构建脚本，将所有构建放在这里来。

1. 当触发某个包的 build 之前，turbo 会优先触发依赖包的 build。
2. 此时，需要判断当前包的版本号和远程是否相等。（作为依赖判断是否需要重新构建）
   1. 如何判断，最直接的方式是读当前包的版本检查远程是否存在该版本。
   2. 或者能否从 git 上一次的提交记录上来读取是否存在版本号变更呢？(不能单纯的从上一次的提交记录来判断，还是优先从远程查吧。直接从 npm view 去检查，存在则构建发布。不存在则不进行发布)。

## Usage

```sh
npx ctrip create
```

### 支持 `prefix` 参数

```sh
npx ctrip create --prefix=dist
```

- `--prefix` `cwd` 之后会拼接 `prefix` 作为 dir 。
