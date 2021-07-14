#include <tvg.hpp>

uint64_t tvg::get_id(id_type type)
{
   auto s = status.get_or_create(get_self(), default_status);

   uint64_t result = 0;

   switch (type)
   {
   case nft_id:
      result = ++s.nft_id;
      break;
   }

   status.set(s, get_self());

   return result;
}

uint64_t tvg::create(name &author, name &owner, string &data)
{
   require_auth(author);
   require_auth(get_self());
   check(is_account(owner), "owner account does not exist");
   //require_recipient( owner );

   uint64_t newID = get_id(nft_id);

   nfts_table nfts(get_self(), get_self().value);
   nfts.emplace(get_self(), [&](auto &s)
                {
                   s.id = newID;
                   s.author = author;
                   s.owner = owner;
                   s.author = author;
                   s.data = data; // immutable data
                });
   return newID;
}

bool tvg::transfer(uint64_t id, name &owner, name &new_owner)
{
   require_auth(owner);
   check(is_account(new_owner), "new owner account does not exist");
   //require_recipient( new_owner );
   nfts_table nfts(get_self(), get_self().value);

   auto itr = nfts.find(id);
   check(itr != nfts.end(), "nft doesn't exists");
   check(itr->owner == owner, "not your nft!");

   nfts.modify(itr, get_self(), [&](auto &g)
               { g.owner = new_owner; });

   return true;
}