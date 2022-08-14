---
name: 'AuthApi'
root: './'
output: '**/*'
ignore: []
questions:
  module: 'Enter module(directory) name'
  component: 'Enter component name'
  bool:
    confirm: 'Is slug param string value?'
  required: 'Enter post required params(if multiple, combine with "," )'
---

# `pages/api/{{ inputs.module | lower }}/index.ts`

```ts
import type { NextApiResponse } from 'next';
import type {
  NextApiRequestWithUserId,
  NextApiHandlerWithUserId,
} from '../../../types/RequestType';
import { prisma } from '../../../lib/Prisma';
import { authenticated } from '../../../handlers/BearerAuth';
import type {
  {{ inputs.component | pascal }}ResponseType,
  {{ inputs.component | pascal }}PostPropsType,
} from '../../../types/{{ inputs.component | pascal }}Type'
import type { ErrType } from '../../../types/ErrorType';
import { err400, err405, err500 } from '../../../lib/ErrorMessages';

const getHandler = async (
  req: NextApiRequestWithUserId,
  res: NextApiResponse<{{ inputs.component | pascal }}ResponseType[] | ErrType>
) => {
  let statusCode = 200;
  const resBody: {{ inputs.component | pascal }}ResponseType[] | ErrType = await prisma.{{ inputs.component | lower }}
    .findMany({
      orderBy: [{ id: 'desc' }],
    })
    .catch((err) => {
      console.error(err);
      statusCode = 500;
      return err500;
    })
    .finally(async () => prisma.$disconnect());

  return res.status(statusCode).json(resBody);
};

const postHandler = async (
  req: NextApiRequestWithUserId,
  res: NextApiResponse<{{ inputs.component | pascal }}ResponseType | ErrType>
) => {
  const { {{ inputs.required | replace "," ", " }} }: {{ inputs.component | pascal }}PostPropsType = req.body;
  let statusCode = 200;
  let resBody: {{ inputs.component | pascal }}ResponseType | ErrType;

  if (!{{ inputs.required | replace "," " || !" }}) {
    statusCode = 400;
    resBody = err400;
  } else {
    resBody = await prisma.{{ inputs.component | lower }}
      .create({ data: req.body })
      .catch((err) => {
        console.error(err);
        statusCode = 500;
        return err500;
      })
      .finally(async () => prisma.$disconnect());
  }

  return res.status(statusCode).json(resBody);
};

const handler: NextApiHandlerWithUserId = (
  req: NextApiRequestWithUserId,
  res: NextApiResponse
) => {
  switch (req.method) {
    case 'GET':
      getHandler(req, res);
      break;
    case 'POST':
      postHandler(req, res);
      break;
    default:
      return res.status(405).json(err405);
  }
};

export default authenticated(handler);
```

# `pages/api/{{ inputs.module | lower }}/[{{ inputs.component | lower }}Id].ts`

```ts
import type { NextApiResponse } from 'next';
import type {
  NextApiRequestWithUserId,
  NextApiHandlerWithUserId,
} from '../../../types/RequestType';
import { prisma } from '../../../lib/Prisma';
import { authenticated } from '../../../handlers/BearerAuth';
import type {
  {{ inputs.component | pascal }}ResponseType,
  {{ inputs.component | pascal }}PutPropsType,
} from '../../../types/{{ inputs.component | pascal }}Type'
import type { ErrType } from '../../../types/ErrorType';
import { err400, err405, err500 } from '../../../lib/ErrorMessages';

const getHandler = async (
  req: NextApiRequestWithUserId,
  res: NextApiResponse<{{ inputs.component | pascal }}ResponseType | ErrType | null>
) => {
  const { {{ inputs.component | lower }}Id } = Array.isArray(req.query) ? req.query[0] : req.query;
  let statusCode = 200;
  const resBody: {{ inputs.component | pascal }}ResponseType | ErrType | null = await prisma.{{ inputs.component | lower }}
    .findUnique({
      {{ if inputs.bool }}where: { {{ inputs.component | lower }}Id },{{ else }}where: { id: +{{ inputs.component | lower }}Id },{{ end }}
    })
    .then((res) => {
      if (res === null) statusCode = 204;
      return res;
    })
    .catch((err) => {
      console.error(err);
      statusCode = 500;
      return err500;
    })
    .finally(async () => prisma.$disconnect());

  return res.status(statusCode).json(resBody);
};

const putHandler = async (
  req: NextApiRequestWithUserId,
  res: NextApiResponse<{{ inputs.component | pascal }}ResponseType | ErrType>
) => {
  const { {{ inputs.component | lower }}Id } = Array.isArray(req.query) ? req.query[0] : req.query;
  let statusCode = 200;
  let resBody: {{ inputs.component | pascal }}ResponseType | ErrType;
  if (Object.keys(req.body).length === 0) {
    statusCode = 400;
    resBody = err400;
  } else {
    resBody = await prisma.{{ inputs.component | lower }}
      .update({
        {{ if inputs.bool }}where: { {{ inputs.component | lower }}Id },{{ else }}where: { id: +{{ inputs.component | lower }}Id },{{ end }}
        data: req.body,
      })
      .catch((err) => {
        console.error(err);
        statusCode = 500;
        return err500;
      })
      .finally(async () => prisma.$disconnect());
  }

  return res.status(statusCode).json(resBody);
};

const deleteHandler = async (
  req: NextApiRequestWithUserId,
  res: NextApiResponse<null | ErrType>
) => {
  const { {{ inputs.component | lower }}Id } = Array.isArray(req.query) ? req.query[0] : req.query;
  let statusCode = 204;
  const resBody: null | ErrType = await prisma.{{ inputs.component | lower }}
    .delete({
      {{ if inputs.bool }}where: { {{ inputs.component | lower }}Id },{{ else }}where: { id: +{{ inputs.component | lower }}Id },{{ end }}
    })
    .then((res) => {
      return null;
    })
    .catch((err) => {
      console.error(err);
      statusCode = 500;
      return err500;
    })
    .finally(async () => prisma.$disconnect());

  return res.status(statusCode).json(resBody);
};

const handler: NextApiHandlerWithUserId = (
  req: NextApiRequestWithUserId,
  res: NextApiResponse
) => {
  switch (req.method) {
    case 'GET':
      getHandler(req, res);
      break;
    case 'PUT':
      putHandler(req, res);
      break;
    case 'DELETE':
      deleteHandler(req, res);
      break;
    default:
      return res.status(405).json(err405);
  }
};

export default authenticated(handler);
```

# `types/{{ inputs.component | pascal }}Type.ts`

```ts
import { Prisma } from '@prisma/client';
import type { {{ inputs.component | pascal }} } from '@prisma/client';

export type {{ inputs.component | pascal }}ResponseType = {{ inputs.component | pascal }} & {}
export type {{ inputs.component | pascal }}PostPropsType = Prisma.{{ inputs.component | pascal }}CreateInput & {}
export type {{ inputs.component | pascal }}PutPropsType = Prisma.{{ inputs.component | pascal }}UpdateInput & {}

```
