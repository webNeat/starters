import ts from 'typescript'
import { readFile } from 'fs/promises'

export async function create_program(files: Record<string, string> = {}) {
  const tsconfig = ts.parseJsonConfigFileContent(JSON.parse(await readFile('tsconfig.json', 'utf8')), ts.sys, './')
  const source_files: Record<string, ts.SourceFile> = {}
  for (const [path, content] of Object.entries(files)) {
    source_files[path] = ts.createSourceFile(path, content, ts.ScriptTarget.ES2015, true)
  }
  const file_names = Array.from(new Set([...tsconfig.fileNames, ...Object.keys(files)]))
  return ts.createProgram(file_names, tsconfig.options, create_host(tsconfig.options, source_files))
}

function create_host(options: ts.CompilerOptions, source_files: Record<string, ts.SourceFile>): ts.CompilerHost {
  const host = ts.createCompilerHost(options)
  const get_source_file = host.getSourceFile
  host.getSourceFile = (filename, language_version) => source_files[filename] || get_source_file(filename, language_version)
  return host
}

export async function get_vine_types(program: ts.Program, filename: string, var_name: string) {
  const source_file = program.getSourceFile(filename)
  if (!source_file) return null

  const checker = program.getTypeChecker()
  let declaration: ts.VariableDeclaration | undefined
  ts.forEachChild(source_file, function visit(node) {
    if (ts.isVariableDeclaration(node) && node.name.getText() === var_name) {
      declaration = node
    } else {
      ts.forEachChild(node, visit)
    }
  })

  if (!declaration) return null
  const type = checker.getTypeAtLocation(declaration)
  const type_args = checker.getTypeArguments(type as ts.TypeReference)
  if (type_args?.length === 4) {
    return {
      input: checker.typeToString(type_args[1]),
      output: checker.typeToString(type_args[2]),
    }
  }
  return null
}
