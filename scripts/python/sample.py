#! venv/bin python3app
import asyncio
import time


# Functions
async def sample_function1():
    return "file: sample | This is sample_function1 from sample file"


async def sample_function2():
    return "file: sample | This is sample_function2 from sample file"


async def test_starter(arg):
    if arg['body']['step'] == 'first':
        return 'im first'
    elif arg['body']['step'] == 'second':
        await asyncio.sleep(5)
        return 'im second'
    elif arg['body']['step'] == 'third':
        await asyncio.sleep(10)
        return 'im third'


async def print_my_full_name(data):
    first_name = data['body']['first_name']
    last_name = data['body']['last_name']
    return "my fullname is " + first_name + ' ' + last_name
