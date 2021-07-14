project(tvg)

set(EOSIO_WASM_OLD_BEHAVIOR "Off")
find_package(eosio.cdt)

add_contract( tvg tvg tvg.cpp )
target_include_directories( tvg PUBLIC ${CMAKE_SOURCE_DIR}/../include )
target_ricardian_directory( tvg ${CMAKE_SOURCE_DIR}/../ricardian )