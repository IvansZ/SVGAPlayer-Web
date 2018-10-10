interface Parser {
  worker?: Worker

  do (data: ArrayBuffer): Promise<Object>
}
