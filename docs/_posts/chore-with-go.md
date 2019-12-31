---
title: go小事二三
date: 2019-12-25 22:35:00
category: golang
tags:
  - chore
---
关联仓库 [yuchanns/gobyexample](https://github.com/yuchanns/gobyexample)
<!-- more -->

[[toc]]

## 编写测试用例
在同文件目录下，创建以_test为后缀的文件。引入testing包，编写测试函数。

接着进行测试模块编译`go test -c -o test_xxx /path/to/package`
:::tip
测试功能函数：`TestXXX`

进行功能测试：`./test_xxx -test.v -test.run TestXXX`

测试性能函数：`BenchmarkXXX`

进行性能测试：`./test_xxx -test.v -test.bench BenchmarkXXX`
:::

例：

```go
package example
// example.go

import "fmt"

type Sample struct {
  // just a sample
}

func (Sample) Greet() {
  fmt.Println("Hello world")
}
```

```go
package example
// example_test.go

import "testing"

func TestSample_Greet(t *testing.T) {
  s := &Sample{}
  s.Greet()
}
// output:
// === RUN   TestSample_Greet
// Hello world
// --- PASS: TestSample_Greet (0.00s)
// PASS

func BenchmarkSample_Greet(t *testing.B) {
  s := &Sample{}
  s.Greet()
}
// output:
// Hello world
// goos: darwin
// goarch: amd64
// pkg: example
// BenchmarkSample_Greet-12    	Hello world
// Hello world
// Hello world
// Hello world
// Hello world
// 1000000000	         0.000012 ns/op
// PASS
```

## 使用RSA加密
使用官方**crypto**（效率较低，等待补充cgo的openssl）

RSA密钥加密长度有限，需要分割加密内容，使用go的**切片**特性来实现切割，最后利用**bytes.Join**合并，加密输出base64。
```go
package rsa

import (
	"bytes"
	"crypto/rand"
	"crypto/rsa"
	"crypto/x509"
	"encoding/base64"
	"encoding/json"
	"encoding/pem"
	"errors"
)

var pubkey = []byte(`-----BEGIN PUBLIC KEY-----
MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQCsYmysgY/RHSUMkfXk2Tt/g9sv
JssYzBGD9YjCddSCZbVSTEZX9zcC9eRrhLWx1zO/wvnkGIzipe3qakasmv3wECPw
bJf0bHiY429Z2tH65s+LZWjSGoxL7S4uNO+hAD//aiKYPJnhfjnbtxKnfJkcEdxG
B4/44oI4vC4xn00/zwIDAQAB
-----END PUBLIC KEY-----`)

func getPubKey() (pub *rsa.PublicKey, err error) {
	var (
		block        *pem.Block
		pubInterface interface{}
	)

	block, _ = pem.Decode(pubkey)
	if block == nil {
		err = errors.New("public key invalid")
		return
	}

	pubInterface, err = x509.ParsePKIXPublicKey(block.Bytes)

	if err != nil {
		return
	}

	pub = pubInterface.(*rsa.PublicKey)

	return
}

func Encrypt(data *map[string]interface{}) (encrypted string, err error) {
	var (
		jsonByte []byte
		encrypt  []byte
		pub      *rsa.PublicKey
		sliceLen = maxEncodeLength
	)

	pub, err = getPubKey()
	if err != nil {
		return
	}

	jsonByte, err = json.Marshal(data)
	if err != nil {
		return
	}

	jsonByteLen := len(jsonByte)

	encrypts := make([][]byte, jsonByteLen/maxEncodeLength+1)

	for i := 0; i < jsonByteLen; i = i + sliceLen {
		length := jsonByteLen - i
		if length < maxEncodeLength {
			sliceLen = length
		}
		encrypt, err = rsa.EncryptPKCS1v15(rand.Reader, pub, jsonByte[i:i+sliceLen])
		if err != nil {
			return
		}

		encrypts = append(encrypts, encrypt)
	}

	encrypted = base64.StdEncoding.EncodeToString(bytes.Join(encrypts, []byte("")))

	return
}
```
## 使用net/http客户端
```go
package httpclient

import (
  "bytes"
  "io/ioutil"
  "net/http"
	"net/url"
	"strings"
)

const (
  baseUri = "https://www.yuchanns.xyz"
)

func Send(target string, data string) (content string, err error) {
  var resp *http.Response
  resp, err = http.PostForm(strings.Join([]string{
    baseUri,
    target,
  }, "/"), url.Values{"name": {data}})
  if err != nil {
    return
  }
  defer resp.Body.Close()

  var body []byte
  body, err = ioutil.ReadAll(resp.Body)

  if err == nil {
    content = bytes.NewBuffer(body).String()
  }

  return
}
```
## defer和return和具名return
待更新
