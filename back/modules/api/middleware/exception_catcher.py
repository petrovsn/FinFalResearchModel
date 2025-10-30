from fastapi import Request
from fastapi.responses import JSONResponse
from modules.utils.logger import Logger
from modules.core.exceptions import BaseCustomException, ObjectNonExists
import traceback


async def exception_catcher(request: Request, call_next):
    try:
        response = await call_next(request)
        return response
    except BaseCustomException as e:
        return JSONResponse(status_code=e.code, content={
            "message":e.message,
            "code": e.code,
            "object":e.object
            })

    except ObjectNonExists as e:
        return JSONResponse(status_code=e.code, content=e.message)

    except Exception as exc:
        #Logger().critical("", str(Request.url), "", "critical error", str(exc) )
        #original_exc = getattr(exc, "__context__", exc)
        #print(traceback.format_exc(exc))
        return JSONResponse(status_code=500, content="Internal error")
