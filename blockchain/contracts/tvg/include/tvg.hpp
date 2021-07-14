#include <eosio/eosio.hpp>
#include <eosio/singleton.hpp>
using namespace eosio;
using namespace std;

CONTRACT tvg : public contract
{
public:
   using contract::contract;
   tvg(name receiver, name code, datastream<const char *> ds) : contract(receiver, code, ds), status(receiver, receiver.value) {}

   enum id_type
   {
      nft_id = 0
   };

   /*
   * global singelton table. Scope: self
   */
   TABLE global
   {
      uint64_t nft_id;

      EOSLIB_SERIALIZE(global, (nft_id))
   }
   default_status = {1000000};

   typedef singleton<"global"_n, global> global_type; /// singleton
   global_type status;

   /*
   * Nft table
   * Scope: asset owner
   */
   TABLE nft
   {
      uint64_t id;
      name author;
      name owner;
      string data; // immutable data

      auto primary_key() const { return id; }
      uint64_t by_author() const { return author.value; }
      uint64_t by_owner() const { return owner.value; }
      EOSLIB_SERIALIZE(nft, (id)(author)(owner)(data))
   };
   typedef eosio::multi_index<"nfts"_n, nft,
                              eosio::indexed_by<"author"_n, eosio::const_mem_fun<nft, uint64_t, &nft::by_author>>,
                              eosio::indexed_by<"owner"_n, eosio::const_mem_fun<nft, uint64_t, &nft::by_owner>>>
       nfts_table;

   /*
   * Get new id
   *
   * return id for a new nft or other data.
   *
   * @param type is id number must be ( nft_id = 0 )
   * @return id 
   */

   uint64_t get_id(id_type type);

   /*
   * Create a new nft.
   *
   * This action creates a new nft.
   *
   * @param author is the nft's author.
   * @param owner is nft owner.
   * @param data is stringified JSON or sha256 string with immutable asset data.
   * @return uint64_t nft's id
   */
   [[eosio::action]] uint64_t create(name & author, name & owner, string & data);
   using create_action = action_wrapper<"create"_n, &tvg::create>;

   [[eosio::action]] bool transfer(uint64_t id, name & owner, name & new_owner);
   using transfer_action = action_wrapper<"transfer"_n, &tvg::transfer>;
};