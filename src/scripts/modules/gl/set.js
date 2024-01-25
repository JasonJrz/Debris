
export function setUniforms(setters, ...values) {
  setters = setters.uniformSetters || setters

  for(const uniforms of values) {
    Object.keys(uniforms).forEach(name => {
      const setter = setters[name]

      if(setter) setter(uniforms[name])
    })
  }
}

export function createUniformSetters(gl, program) {
  let textureUnit = 0

  function createUniformSetter(program, uniformInfo) {
    const location = gl.getUniformLocation(program, uniformInfo.name)
    const type = uniformInfo.type

    const isArray = (uniformInfo.size > 1 && uniformInfo.name.substr(-3) === '[0]')

    if(type === gl.FLOAT && isArray) {
      return function(value) {
        gl.uniform1fv(location, value)
      }
    }
    if (type === gl.FLOAT_VEC2) {
      return function(value) {
        gl.uniform2fv(location, value)
      }
    }
    if (type === gl.FLOAT_VEC3) {
      return function(value) {
        gl.uniform3fv(location, value)
      }
    }
    if (type === gl.FLOAT_VEC4) {
      return function(value) {
        gl.uniform4fv(location, value)
      }
    }
    if (type === gl.INT && isArray) {
      return function(value) {
        gl.uniform1iv(location, value)
      }
    }
    if (type === gl.INT) {
      return function(value) {
        gl.uniform1i(location, value)
      }
    }
    if (type === gl.INT_VEC2) {
      return function(value) {
        gl.uniform2iv(location, value)
      }
    }
    if (type === gl.INT_VEC3) {
      return function(value) {
        gl.uniform3iv(location, value)
      }
    }
    if (type === gl.INT_VEC4) {
      return function(value) {
        gl.uniform4iv(location, value)
      }
    }
    if (type === gl.BOOL) {
      return function(value) {
        gl.uniform1iv(location, value)
      }
    }
    if (type === gl.BOOL_VEC2) {
      return function(value) {
        gl.uniform2iv(location, value)
      }
    }
    if (type === gl.BOOL_VEC3) {
      return function(value) {
        gl.uniform3iv(location, value)
      }
    }
    if (type === gl.BOOL_VEC4) {
      return function(value) {
        gl.uniform4iv(location, value)
      }
    }
    if (type === gl.FLOAT_MAT2) {
      return function(value) {
        gl.uniformMatrix2fv(location, false, value)
      }
    }
    if (type === gl.FLOAT_MAT3) {
      return function(value) {
        gl.uniformMatrix3fv(location, false, value)
      }
    }
    if (type === gl.FLOAT_MAT4) {
      return function(value) {
        gl.uniformMatrix4fv(location, false, value)
      }
    }
    if ((type === gl.SAMPLER_2D || type === gl.SAMPLER_CUBE) && isArray) {
      const units = []
      for (let ii = 0; ii < info.size; ++ii) {
        units.push(textureUnit++)
      }
      return function(bindPoint, units) {
        return function(textures) {
          gl.uniform1iv(location, units)
          textures.forEach(function(texture, index) {
            gl.activeTexture(gl.TEXTURE0 + units[index])
            gl.bindTexture(bindPoint, texture)
          })
        }
      }(getBindPointForSamplerType(gl, type), units)
    }
    if (type === gl.SAMPLER_2D || type === gl.SAMPLER_CUBE) {
      return function(bindPoint, unit) {
        return function(texture) {
          gl.uniform1i(location, unit)
          gl.activeTexture(gl.TEXTURE0 + unit)
          gl.bindTexture(bindPoint, texture)
        }
      }(getBindPointForSamplerType(gl, type), textureUnit++)
    }
    throw ('unknown type: 0x' + type.toString(16)) // we should never get here.
  }

  const uniformSetters = { }
  const numUniforms = gl.getProgramParameter(program, gl.ACTIVE_UNIFORMS)

  for (let ii = 0; ii < numUniforms; ++ii) {
    const uniformInfo = gl.getActiveUniform(program, ii)

    if (!uniformInfo) {
      break
    }

    let name = uniformInfo.name
    // remove the array suffix.
    if (name.substr(-3) === '[0]') {
      name = name.substr(0, name.length - 3)
    }
    const setter = createUniformSetter(program, uniformInfo)
    uniformSetters[name] = setter
  }
  return uniformSetters
}

export function setAttributes(setters, attribs) {
  setters = setters.attributeSetters || setters

  Object.keys(attribs).forEach(name => {
    const setter = setters[name]

    if(setter) setter(attribs[name])
  })
}

export function createAttributeSetters(gl, program) {
  const attributeSetters = {}

  function createAttributeSetter(index) {
    return function(b) {
      if(b.value) {
        gl.disableVertexAttribArray(index)

        switch(b.value.length) {
          case 4:
            gl.vertexAttrib4fv(index, b.value)
            break
          case 3:
            gl.vertexAttrib3fv(index, b.value)
            break
          case 2:
            gl.vertexAttrib2fv(index, b.value)
            break
          case 1:
            gl.vertexAttrib1fv(index, b.value)
            break
          default:
            throw new Error('the length of a float constant value must be between 1 and 4!')
        }
      } else {
        gl.bindBuffer(gl.ARRAY_BUFFER, b.buffer)
        gl.enableVertexAttribArray(index)
        gl.vertexAttribPointer(
          index,
          b.numComponents || b.size,
          b.type || gl.FLOAT,
          b.normalize || false,
          b.stride || 0,
          b.offset || 0
        )
      }
    }
  }

  const numAttribs = gl.getProgramParameter(program, gl.ACTIVE_ATTRIBUTES)

  for(let ii = 0; ii < numAttribs; ++ii) {
    const attribInfo = gl.getActiveAttrib(program, ii)

    if(!attribInfo) break

    const index = gl.getAttribLocation(program, attribInfo.name)
    attributeSetters[attribInfo.name] = createAttributeSetter(index)

    return attributeSetters
  }
}